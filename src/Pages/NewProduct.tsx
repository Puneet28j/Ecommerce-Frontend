import React, { FormEvent, useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, PlusCircleIcon, PlusIcon, X } from "lucide-react";
import { FloatingInput, FloatingLabel } from "../components/ui/floating-label";
import { ScrollArea } from "../components/ui/scroll-area";
import { RootState } from "../redux/store";
import { productAPI } from "../redux/api/productAPI";
import { responseToast } from "../utils/features";
import toast from "react-hot-toast";

// Types
interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  photo: File[];
  photoPrevs: string[];
}

interface DragDropZoneProps {
  onFileChange: (files: FileList | null) => void;
  multiple?: boolean;
}

interface ImagePreviewProps {
  previews: string[];
  onRemove: (index: number) => void;
}

interface FormFieldsProps {
  type?: string;
  placeholder: string;
  label: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

// DragDropZone Component
const DragDropZone: React.FC<DragDropZoneProps> = ({
  onFileChange,
  multiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files?.length) onFileChange(files);
    },
    [onFileChange]
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-lg border-2 border-dashed p-6 text-center transition-all",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25 hover:border-primary/50"
      )}
    >
      <input
        type="file"
        multiple={multiple}
        onChange={(e) => onFileChange(e.target.files)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        accept="image/*"
      />
      <div className="space-y-2">
        <PlusCircleIcon className="mx-auto h-8 w-8 text-muted-foreground" />
        <div className="text-sm font-medium">
          <span className="text-primary">Click to upload</span> or drag and drop
        </div>
        <div className="text-xs text-muted-foreground">
          PNG, JPG or JPEG (max. 10MB each)
        </div>
      </div>
    </div>
  );
};

// ImagePreview Component
const ImagePreview: React.FC<ImagePreviewProps> = ({ previews, onRemove }) => {
  if (!previews.length) return null;

  return (
    <div className="w-full rounded-md border">
      <div className="grid grid-cols-3 gap-2 p-2 md:grid-cols-4 lg:grid-cols-5">
        {previews.map((preview, index) => (
          <div
            key={`image-preview-${index}`}
            className="group relative aspect-square"
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="h-full w-full rounded-md object-cover"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
              type="button"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// FormFields Component
const FormFields: React.FC<FormFieldsProps> = ({
  type = "text",
  placeholder,
  label,
  value,
  onChange,
  step,
}) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

  return isDesktop ? (
    <div className="grid gap-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <Input
        value={value}
        onChange={onChange}
        type={type}
        id={label.toLowerCase()}
        placeholder={placeholder}
        className="block w-full text-sm focus:outline-none"
        step={step}
      />
    </div>
  ) : (
    <div className="relative grid gap-2">
      <FloatingInput
        value={value}
        onChange={onChange}
        className="block w-full text-sm focus:outline-none"
        type={type}
        id={label.toLowerCase()}
        step={step}
      />
      <FloatingLabel htmlFor={label.toLowerCase()}>{label}</FloatingLabel>
    </div>
  );
};

// Main NewProduct Component
export const NewProduct = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { user } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();
  const [newProduct] = productAPI.useNewProductMutation();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    photo: [],
    photoPrevs: [],
  });

  const handleInputChange = (field: keyof Product, value: string | number) => {
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

    if (validFiles.length !== files.length) {
      toast.error(
        "Some files were skipped: Please only upload images under 10MB."
      );
    }

    setFormData((prev) => ({
      ...prev,
      photo: [...prev.photo, ...validFiles],
      photoPrevs: [...prev.photoPrevs, ...validFiles.map(URL.createObjectURL)],
    }));
  }, []);

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photo];
      const newPreviews = [...prev.photoPrevs];
      URL.revokeObjectURL(newPreviews[index]);
      newPhotos.splice(index, 1);
      newPreviews.splice(index, 1);
      return { ...prev, photo: newPhotos, photoPrevs: newPreviews };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("User not authenticated");
      return;
    }

    const { name, description, price, stock, category, photo } = formData;
    if (
      !name.trim() ||
      price <= 0 ||
      stock < 0 ||
      !category.trim() ||
      !photo.length ||
      !description.trim()
    ) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "photo" && key !== "photoPrevs") {
        submitData.set(key, value.toString());
      }
    });
    formData.photo.forEach((file) => submitData.append("photo", file));

    try {
      const res = await newProduct({ id: user._id, formData: submitData });
      responseToast(res, navigate, "/admin/products");
      if (res) setOpen(false);
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("An error occurred while creating the product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        category: "",
        price: 0,
        stock: 0,
        photo: [],
        photoPrevs: [],
      });
    }
  }, [open]);

  const renderForm = () => (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="space-y-4">
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
          onChange={(e) => handleInputChange("description", e.target.value)}
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
            onChange={(e) => handleInputChange("category", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Product Images</Label>
          <DragDropZone onFileChange={handleFileChange} />
          <ImagePreview previews={formData.photoPrevs} onRemove={removeImage} />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="mt-4">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Creating product...</span>
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircleIcon />
          <span className="hidden sm:block">New Product</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] max-h-[900px] flex-col gap-0 p-0 sm:max-w-[600px]">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>
            Create your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6">{renderForm()}</ScrollArea>
        <div className="flex items-center gap-2 p-6 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col h-[90vh]">
        <DrawerHeader className="px-6 pb-4">
          <DrawerTitle>New Product</DrawerTitle>
          <DrawerDescription>
            Create your product here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="flex-1 px-6">{renderForm()}</ScrollArea>
        <DrawerFooter className="px-6 pt-4">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NewProduct;
