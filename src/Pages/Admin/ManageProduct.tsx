import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { productAPI } from "../../redux/api/productAPI";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { DragDropZone, FormFields } from "../NewProduct";
import { Label } from "../../components/ui/label";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Loader2, Save, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  photo: File[];
  existingPhotos: Array<{ public_id: string; url: string }>;
}

const ManageProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: productData } = productAPI.useProductDetailsQuery(id || "");
  const [updateProduct] = productAPI.useUpdateProductMutation();
  const [deleteProduct] = productAPI.useDeleteProductMutation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    photo: [],
    existingPhotos: [],
  });

  useEffect(() => {
    if (productData?.product) {
      const { name, description, price, stock, category, photo } =
        productData.product;
      setFormData({
        name,
        description,
        price,
        stock,
        category,
        photo: [],
        existingPhotos: photo || [],
      });
    }
  }, [productData]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
    );

    if (!validFiles.length) {
      toast.error("No valid images selected. Please upload images under 10MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      photo: [...prev.photo, ...validFiles],
    }));
  }, []);

  const removeExistingImage = (publicId: string) => {
    setFormData((prev) => ({
      ...prev,
      existingPhotos: prev.existingPhotos.filter(
        (photo) => photo.public_id !== publicId
      ),
    }));
  };

  const removeNewImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photo: prev.photo.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    const form = new FormData();

    // Add basic fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "photo" && key !== "existingPhotos") {
        form.append(key, value.toString());
      }
    });

    // Add existing photos
    form.append("existingPhotos", JSON.stringify(formData.existingPhotos));

    // Add new photos
    formData.photo.forEach((file) => {
      form.append("photo", file);
    });

    try {
      const result = await updateProduct({
        productId: id!,
        userId: user._id,
        formData: form,
      }).unwrap();

      toast.success(result.message);
      navigate("/admin/products");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?._id || !id) return;

    setDeleteLoading(true);
    try {
      const result = await deleteProduct({
        userId: user._id,
        productId: id,
      }).unwrap();

      toast.success(result.message);
      navigate("/admin/products");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Product</CardTitle>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteLoading}>
                  {deleteLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product from your store.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <ScrollArea className="h-[80vh]">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormFields
                label="Title"
                placeholder="Enter product title..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <FormFields
                type="number"
                label="Price"
                placeholder="Enter product price..."
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                step="0.01"
              />
              <FormFields
                label="Description"
                placeholder="Enter product description..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <FormFields
                  type="number"
                  label="Stock"
                  placeholder="Enter product stock..."
                  value={formData.stock}
                  onChange={(e) =>
                    handleInputChange("stock", parseInt(e.target.value) || 0)
                  }
                  step="1"
                />
                <FormFields
                  label="Category"
                  placeholder="Enter product category..."
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.existingPhotos.map((photo) => (
                    <div key={photo.public_id} className="relative group">
                      <img
                        src={photo.url}
                        alt="Product"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingImage(photo.public_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <DragDropZone onFileChange={handleFileChange} />
                {formData.photo.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.photo.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ManageProduct;
