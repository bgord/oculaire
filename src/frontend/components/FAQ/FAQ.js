import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const FAQS = [
	{
		question: "Jak rozsądnie wybrać cel?",
		answer:
			"Wybranie celu to ważny aspekt korzystania z tej aplikacji. Nie powinno się nakładać zbyt dużych obciążeń dla organizmu. Mówi się, że maksymalnym zdrowym tempem chudnięcia jest jest 1kg/tydzień.",
	},
	{
		question: "Jak często sprawdzać wagę?",
		answer:
			"Wagę można dodować codziennie. To od Twoich osobistych preferencji zależy, jak często chcesz sprawdzać swój postęp. Rozsądnym interwałem mogą być trzy dni. Nie nakłada to na Tobie wielkiej presji, a na początku efekty mogą być pozytywnie zaskakujące!",
	},
];

const faq_to_li = (faq, i) => {
	const question_slug = faq.question
		.substring(0, faq.question.length - 1)
		.toLowerCase()
		.split(" ")
		.join("-");
	const base_url = document.URL.split("#")[0];
	return (
		<li className="faq__section__list__item" id={question_slug} key={i}>
			<h3 className="faq__section__list__item__question">
				{faq.question}
				<CopyToClipboard text={`${base_url}#${question_slug}`}>
					<span
						style={{ paddingLeft: "0.3rem", cursor: "pointer" }}
						title="Skopiuj link do pytania"
					>
						&#x1F517;
					</span>
				</CopyToClipboard>
			</h3>
			<p>{faq.answer}</p>
		</li>
	);
};

module.exports = () => (
	<section className="faq__section">
		<h2 className="faq__section__header">FAQ (często zadawane pytania)</h2>
		<ul className="faq__section__list">
			{FAQS.map((faq, i) => faq_to_li(faq, i))}
		</ul>
	</section>
);
