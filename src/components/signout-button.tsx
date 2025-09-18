'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const SignOutButton = ({ redirectUrl }: { redirectUrl?: string }) => {
    const router = useRouter();
    return <Button onClick={() => router.push(redirectUrl || '/auth/sign-in')}>Sign Out</Button>;
};