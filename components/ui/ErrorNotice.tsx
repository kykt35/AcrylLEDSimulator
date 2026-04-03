"use client";

import React from "react";

type ErrorNoticeProps = {
  title?: string;
  message: string;
};

export function ErrorNotice({ title = "エラー", message }: ErrorNoticeProps) {
  return (
    <div className="error-notice" role="alert">
      <p className="error-title">{title}</p>
      <p className="error-message">{message}</p>
    </div>
  );
}
