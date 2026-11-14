import { ArrowRight, Mail, Phone, Send } from "lucide-react";
import Image from "next/image";
import { contact } from "../data/contact";
import employersImg from "../../public/images/employers.jpg";

export function Employers() {
  return (
    <section className="employers" id="employers" aria-labelledby="employers-title">
      <div className="container employers__grid">
        <div className="employers__copy">
          <h2 id="employers-title" className="h2 h2--light">
            Hiring? Send us the vacancy.
          </h2>
          <p className="employers__lede">
            Tell Righton who you need. We publish the vacancy, screen the applicants and bring you
            a shortlist to interview, so your team only meets people worth meeting.
          </p>
          <div className="employers__photo">
            <Image src={employersImg} alt="Hiring team meeting around a white table" placeholder="blur" sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <ul className="channels" id="contact">
            <li>
              <a href={contact.phoneHref}>
                <Phone size={20} aria-hidden="true" />
                <span>
                  <span className="channels__label">Call us</span>
                  <span className="channels__value num">{contact.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>
                <Mail size={20} aria-hidden="true" />
                <span>
                  <span className="channels__label">Email the role</span>
                  <span className="channels__value">{contact.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={contact.telegramHref}>
                <Send size={20} aria-hidden="true" />
                <span>
                  <span className="channels__label">Message on Telegram</span>
                  <span className="channels__value">{contact.telegramHandle}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="panel">
          <h3 className="panel__title">Vacancy request</h3>
          <p className="panel__text">
            Your next great hire is already looking. Put your vacancy in front of thousands of
            qualified job seekers across Ethiopia, and let us bring the best of them to your door.
          </p>
          <a href="/vacancy" className="btn btn--primary btn--lg btn--block">
            Fill in the vacancy form
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
