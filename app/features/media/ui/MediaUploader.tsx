import React from "react";
import type { MediaType } from "../model/types";
import { Button } from "~/shared/ui/Button";
import { canStoreFile } from "../model/db";

interface MediaUploaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;

  limit: number;
  limitLabel: string;

  aspectRatio?: string;

  type: MediaType;
  hook?: React.Dispatch<React.SetStateAction<Blob | undefined>>;
}

export const MediaUploader = ({
  icon,
  title,
  subtitle,
  type,
  limit,
  limitLabel,
  aspectRatio = "1/1",
  hook,
}: MediaUploaderProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<Blob>();
  const [error, setError] = React.useState<string | null>(null);

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > limit) {
      setError("Файл слишком большой");
      return;
    }

    if (!canStoreFile(file.size)) {
      setError("На вашем устройстве заполнено хранилище");
      return;
    }

    setFile(file);

    if (hook) {
      hook(file);
    }
  }

  return (
    <div
      role="button"
      className="bg-muted text-muted-foreground relative flex min-h-fit w-full flex-col items-center justify-center overflow-hidden rounded-2xl border p-5 text-center"
      style={{ aspectRatio: aspectRatio }}
      onClick={() => inputRef.current?.click()}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        {icon}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">{title}</h3>
          <p className="text-xs font-medium text-balance">{subtitle}</p>
        </div>
      </div>
      <div className="bottom-0 flex flex-col gap-2 text-xs">
        {error && <p className="font-medium text-red-500">{error}</p>}
        <p className="font-medium">Лимит {limitLabel}</p>
        <p className="font-bold">Нажмите чтобы загрузить</p>
      </div>

      {file && (
        <>
          {type === "photo" ? (
            <img
              className="absolute inset-0 object-cover object-center"
              style={{ aspectRatio }}
              src={URL.createObjectURL(file)}
              alt="Фото"
            />
          ) : (
            <video
              className="absolute inset-0 object-cover object-center"
              autoPlay
              loop
              muted
              playsInline
              style={{ aspectRatio }}
              src={URL.createObjectURL(file)}
            />
          )}
        </>
      )}

      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={onUpload}
        accept={type === "photo" ? "image/jpeg, image/png" : "video/mp4"}
      />
    </div>
  );
};
