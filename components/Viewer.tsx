"use client";
interface ViewerProps {
  value: string;
}
export default function Viewer(props: ViewerProps) {
  return (
    <div
      className={`min-w-full prose-sm`}
      dangerouslySetInnerHTML={{ __html: props.value }}
    />
  );
}
