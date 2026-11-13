import { contact } from "../data/contact";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Wordmark className="wordmark--footer" />
            <p className="footer__note">
              Recruitment for companies across Ethiopia. Based in {contact.city}.
            </p>
          </div>
          <nav aria-label="Footer" className="footer__links">
            <a href="#vacancies">Vacancies</a>
            <a href="#sectors">Sectors</a>
            <a href="#how-to-apply">How to apply</a>
            <a href="#employers">For employers</a>
          </nav>
          <div className="footer__contact">
            <a href={contact.phoneHref} className="num">{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
        <p className="footer__legal">© {new Date().getFullYear()} Righton</p>
      </div>
    </footer>
  );
}
