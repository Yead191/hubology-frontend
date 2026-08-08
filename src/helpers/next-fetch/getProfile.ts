"use server";

import { cookies } from "next/headers";

const getProfile = async (): Promise<any | null> => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) return null;

    const res = await fetch(`${process.env.BASE_URL}/user/profile`, {
      next: {
        tags: ["user-profile"],
        revalidate: 60 * 60,
      },
      cache: "force-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const { data } = await res.json();

    return data ?? null;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

export default getProfile;
