"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";


export default function MaintenancePage() {
  return (
    <div className="min-h-[90vh] bg-[#0b1818] flex flex-col items-center justify-center px-6 text-white">
      {/* Logo */}
      <div className="mb-12">
        <Image
          src="/logo-mesa.png"
          alt="Mesa Startup Lab"
          width={160}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Wrench / settings icon */}
      <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-full border border-white/10 bg-white/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-9 h-9 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-4">
        We&apos;re Under Maintenance
      </h1>

      {/* Sub-text */}
      <p className="text-white/50 text-center max-w-md text-base leading-relaxed mb-5">
        We&apos;re currently performing scheduled maintenance to improve your
        experience. We&apos;ll be back online shortly. Thank you for your
        patience.
      </p>

      {/* Contact line */}
      <p className="text-white/40 text-sm text-center">
        <a
          href="mailto:msl@mesaschool.co"
          className="text-white/70 underline underline-offset-4 hover:text-white transition-colors"
        >
          msl@mesaschool.co
        </a>
      </p>
    </div>
  );
}
