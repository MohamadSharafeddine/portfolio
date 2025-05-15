interface TitleProps {
  children: string;
}

export default function Title({ children }: TitleProps) {
  return (
    <div className="flex justify-center my-12">
      <div className="inline-block px-6 py-2 border-3">
        <h1 className="text-xl font-bold uppercase">{children}</h1>
      </div>
    </div>
  );
}
