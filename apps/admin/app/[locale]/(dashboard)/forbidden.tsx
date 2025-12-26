import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex h-[calc(100vh-160px)] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center max-w-[400px] text-center">
        <div className="flex h-12 w-12 items-center justify-center  bg-zinc-900 border border-zinc-800 mb-6">
          <ShieldAlert className="h-6 w-6 text-zinc-500" />
        </div>
        
        <h1 className="text-xl font-light text-white mb-2">
          Restricted Access
        </h1>
        
        <p className="text-sm text-zinc-500 font-light leading-relaxed">
          Your account does not have the permissions required to view this content. 
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}