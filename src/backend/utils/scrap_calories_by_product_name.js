const axios = require("axios");
const assert = require("assert");
const { JSDOM } = require("jsdom");

module.exports = async function scrap_calories_by_product_name(product_name) {
	assert(typeof product_name === "string");
	assert(product_name.length > 0);

	const param = encodeURIComponent(product_name);
	const URL = `https://kalkulatorkalorii.net/tabela-kalorii/1/q-${
		param
	}_s-2#wynik`;
	const { data } = await axios.get(URL);
	const DOM = new JSDOM(data);
	const nodes = DOM.window.document.querySelectorAll("tr");

	const results = [];
	nodes.forEach((node, index) => {
		// skipping first 2 nodes, because they're table headers
		if (index > 1) {
			const elem = {};

			elem.name = node.querySelector(":nth-child(1)").textContent.trim();

			elem.calories_per_100g = +node
				.querySelector(":nth-child(2)")
				.textContent.trim();

			results.push(elem);
		}
	});
	return results;
};
