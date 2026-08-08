"use server";

import { cookies } from "next/headers";

const getProfile = async (): Promise<any | null> => {
  // Get request-bound data immediately
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["user-profile"],
        revalidate: 60 * 60,
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error(`Profile API failed: ${res.status}`);
      return null;
    }

    const { data } = await res.json();

    return data ?? null;
  } catch (error) {
    // Backend is down / unreachable
    console.error("Profile API unavailable:", error);
    return null;
  }
};

export default getProfile;
