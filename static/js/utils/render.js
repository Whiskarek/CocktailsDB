const mainTitle = window.document.title;

export async function render(document, view) {
    document.innerHTML = await view.view();
    view.onRender();
    view.onPostRender();
    renderTitle(view);
}

function renderTitle(view) {
    if (view.displayedName) {
        window.document.title = mainTitle + ' - ' + view.displayedName;
    }
}