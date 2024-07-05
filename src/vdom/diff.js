import render from "./render";

const zip = (xs, ys) => {
	const zipped = [];
	for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
		zipped.push([xs[i], ys[i]]);
	}
	return zipped;
};

const diffAttrs = (oldAttrs, newAttrs) => {
	const patches = [];

	// set new attributes
	for (const [k, v] of Object.entries(newAttrs)) {
		console.log([k, v]);
		patches.push(($node) => {
			$node.setAttribute(k, v);
			return $node;
		});
	}

	// remove old attributes
	for (const k in oldAttrs) {
		if (!(k in newAttrs)) {
			patches.push(($node) => {
				$node.remove();
				return $node;
			});
		}
	}

	return ($node) => {
		for (const patch of patches) {
			patch($node);
		}
		return $node;
	};
};

const diffChildren = (oldVChildren, newVChildren) => {
	const childPatches = [];
	for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
		childPatches.push(diff(oldVChild, newVChild));
	}

	const additionalPatches = [];
	for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
		additionalPatches.push(($node) => {
			$node.appendChild(render(additionalVChild));
			return $node;
		});
	}

	return ($parent) => {
		for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
			patch(child);
		}

		for (const patch of additionalPatches) {
			patch($parent);
		}

		return $parent;
	};
};

const diff = (vOldNode, vNewNode) => {
	if (vNewNode === undefined) {
		return ($node) => {
			$node.remove();
			return undefined;
		};
	}

	if (typeof vOldNode === "string" || typeof vNewNode == "string") {
		if (vOldNode !== vNewNode) {
			return ($node) => {
				const $newNode = render(vNewNode);
				$node.replaceWith($newNode);
				return $newNode;
			};
		} else {
			return ($node) => $node;
		}
	}

	if (vOldNode.tagName != vNewNode.tagName) {
		return ($node) => {
			const $newNode = render(vNewNode);
			$node.replaceWith($newNode);
			return $newNode;
		};
	}

	const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
	const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

	return ($node) => {
		patchAttrs($node);
		patchChildren($node);
		return $node;
	};
};

export default diff;
