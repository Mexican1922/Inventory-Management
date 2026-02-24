import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category } from "@/types/inventory";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(categoryList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { categories, loading };
};
