const mainTitle = window.document.title;

export async function render(element, view) {
    await view.onPreRender(element);
    await view.onRender(element);
    await view.onPostRender(element);
    renderTitle(view);
}

function renderTitle(view) {
    if (view.displayedName) {
        window.document.title = mainTitle + ' - ' + view.displayedName;
    }
}