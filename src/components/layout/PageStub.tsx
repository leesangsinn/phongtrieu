export default function PageStub({ title }: { title: string }) {
  return (
    <section className="pt-32 pb-20 bg-cream min-h-[60vh]">
      <div className="container-custom text-center">
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">{title}</h1>
        <p>Nội dung đang được cập nhật.</p>
      </div>
    </section>
  );
}
