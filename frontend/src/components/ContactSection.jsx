export default function ContactSection() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center fw-bold mb-4">Contact Us</h2>

        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <p className="mb-2">
              📞 <strong>Phone:</strong> +91 98765 43210
            </p>
            <p className="mb-2">
              📧 <strong>Email:</strong> info@stonecreations.com
            </p>
            <p>
              💬 <strong>WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="text-success fw-bold"
              >
                Chat Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
