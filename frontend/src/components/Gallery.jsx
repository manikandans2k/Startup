export default function Gallery() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="text-center fw-bold mb-4">Our Work Gallery</h2>

        <div className="row g-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="col-md-4" key={i}>
              <div className="border rounded overflow-hidden">
                <img
                  src={`https://via.placeholder.com/400x250?text=Stone+Work+${i}`}
                  alt="Stone work"
                  className="img-fluid"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
