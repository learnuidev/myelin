"use client";

import { cn } from "@/lib/utils";

import { copyToClipboard } from "@/libs/misc/copy-to-clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

export const CopyToClipboard = ({ text }: { text: string }) => {
  const [showSucces, setShowSuccess] = useState(false);
  return (
    <div className="flex justify-end">
      <button
        className="hover:text-gray-400 transition-all"
        onClick={() => {
          copyToClipboard(text).then(() => {
            setShowSuccess(true);

            setTimeout(() => {
              setShowSuccess(false);
            }, 1200);
          });
        }}
      >
        {showSucces ? (
          <CheckIcon size={20} className="text-green-500" />
        ) : (
          <CopyIcon size={20} />
        )}
      </button>
    </div>
  );
};

export const CodeBlock = ({
  title,
  codeBlock,
  showCopyToClipboard = true,
}: {
  title?: string;
  codeBlock: string;
  showCopyToClipboard?: boolean;
}) => {
  return (
    <div
      className="text-sm my-12 dark:bg-[rgb(14,15,16)] bg-gray-100 p-4 rounded-2xl"
      dir="ltr"
    >
      <div>
        {title && <p className="font-mono text-gray-500 mb-2">{title}</p>}

        <div className="flex justify-between items-center">
          <code>
            <pre>
              <span className="text-gray-800 dark:text-gray-300">
                {codeBlock}
              </span>
            </pre>
          </code>
          {showCopyToClipboard && <CopyToClipboard text={codeBlock} />}
        </div>
      </div>
    </div>
  );
};

interface ChildrenProps {
  children: React.ReactNode;
}

export const SectionContainer = ({ children }: ChildrenProps) => {
  return <div className="my-16">{children}</div>;
};

export const Header3 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "font-bold text-xl font-mono uppercase text-center mb-8",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const Header4 = ({ children }: { children: React.ReactNode }) => {
  return <h4 className="font-semibold text-lg my-4">{children}</h4>;
};

export const Paragraph = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("dark:text-gray-300 text-gray-800 my-4", className)}>
      {children}
    </p>
  );
};
