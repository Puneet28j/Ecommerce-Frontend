import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import axios from "axios";
import { auth } from "../firebase"; // adjust path
import { onAuthStateChanged } from "firebase/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const paginationParams = (pagination: PaginationState) => ({
  page: pagination.pageIndex + 1, // Convert from 0-based to 1-based for API
  limit: pagination.pageSize,
});

export const sortingParams = (sorting: SortingState) => {
  if (sorting.length === 0) return {};
  const { id, desc } = sorting[0];
  return {
    sortBy: id,
    sortOrder: desc ? "desc" : "asc", // Changed from sortDir to sortOrder
  };
};

export const filterParams = (filters: ColumnFiltersState) => {
  const params: Record<string, string> = {};

  filters.forEach((filter) => {
    if (filter.id === "status" && filter.value) {
      params.status = String(filter.value);
    }
    if (filter.id === "pinCode" && filter.value) {
      params.pinCode = String(filter.value);
    }
    // Add any other filters you need to handle
  });

  return params;
};

// Convert an existing Cloudinary upload URL into a transformed URL
// This is a small helper that inserts transformations after /upload/
export const cloudinaryTransform = (
  url: string,
  opts: { w?: number; q?: string } = {}
) => {
  try {
    const { w } = opts;
    const insert = `c_limit${w ? `,w_${w}` : ""},f_auto,q_auto/`;
    return url.replace("/upload/", `/upload/${insert}`);
  } catch {
    return url;
  }
};

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Firebase token automatically
api.interceptors.request.use(
  async (config) => {
    let currentUser = auth.currentUser;

    if (!currentUser) {
      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          currentUser = user;
          unsubscribe();
          resolve();
        });
      });
    }

    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
