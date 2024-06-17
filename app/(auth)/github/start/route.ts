import { redirect } from "next/navigation";

export function GET() {
    const baseURL = "https://github.com/login/oauth/authorize"
    
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        scope:"read:user, user:email",
        allow_signup: "true",
    }

    const formattedParams = new URLSearchParams(params).toString()
    console.log(formattedParams); // client_id=Ov23ligXpRpf8ciXLrNT&scope=read%3Auser%2C+user%3Aemail&allow_signup=true
    
    const finalUrl = `${baseURL}?${formattedParams}`
    console.log(finalUrl); // https://github.com/login/oauth/authorize?client_id=Ov23ligXpRpf8ciXLrNT&scope=read%3Auser%2C+user%3Aemail&allow_signup=true

    return redirect(finalUrl);
}

