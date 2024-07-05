import createElement from "./vdom/createElement";
import render from "./vdom/render";
import mount from "./vdom/mount";
import diff from "./vdom/diff";

const createVApp = (count) =>
	createElement("div", {
		attrs: {
			id: "app",
			dataCount: count,
		},
		children: [
			"The current count is: ",
			String(count),
			createElement("img", {
				attrs: {
					src: "https://media.giphy.com/media/tHIRLHtNwxpjIFqPdV/giphy.gif?cid=790b7611vqse20scra3m3p0n7iwskxggk968hfu0rmo0tspm&ep=v1_gifs_trending&rid=giphy.gif&ct=g",
				},
			}),
		],
	});

let count = 0;
const vApp = createVApp(count);
const $app = render(vApp);
let $rootEl = mount($app, document.getElementById("app"));

setInterval(() => {
	count++;
	const vNewApp = createVApp(count);
	const patch = diff(vApp, vNewApp);
	$rootEl = patch($rootEl);
	vApp = vNewApp;
}, 1000);

console.log($app);
