class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.title = "";
    this.text = "";
    this.id = "";
    this.$placeholder = document.querySelector("#placeholder");
    this.$form = document.querySelector("#form");
    this.$notes = document.querySelector("#notes");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$formButtons = document.querySelector("#form-buttons");
    this.$deleteButton = document.querySelector("#form-close-button");
    this.$modal = document.querySelector(".modal");
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalCloseButton = document.querySelector(".modal-close-button");
    this.$colorTooltip = document.querySelector("#color-tooltip");
    this.render();
    this.addEventListeners();
  }
  addEventListeners() {
    document.body.addEventListener("click", e => {
      this.handleFormClick(e);
      this.selectNote(e);
      this.openModal(e);
      this.deleteNote(e);
    });
    document.body.addEventListener("mouseover", event => {
      this.openTooltip(event);
    });
    document.body.addEventListener("mouseout", event => {
      this.closeTooltip(event);
    });
    this.$colorTooltip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.$colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    this.$colorTooltip.addEventListener("click", event => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
    });

    this.$form.addEventListener("submit", event => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        this.addNote({ title, text });
      }
    });
    this.$deleteButton.addEventListener("click", event => {
      event.stopPropagation();
      this.closeForm();
    });
    this.$modalCloseButton.addEventListener("click", () => {
      this.closeModal();
    });
  }
  handleFormClick(e) {
    const isFormClicked = this.$form.contains(e.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;
    if (isFormClicked) {
      // open form
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      // close form
      this.closeForm();
    }
  }
  openForm() {
    this.$form.classList.add("form-open");
    this.$noteTitle.style.display = "block";
    this.$formButtons.style.display = "block";
  }
  closeForm() {
    this.$form.classList.remove("form-open");
    this.$noteTitle.style.display = "none";
    this.$formButtons.style.display = "none";
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }
  render() {
    this.saveNotes();
    this.displayNotes();
  }
  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }
  openModal(e) {
    if (e.target.matches(".toolbar-delete")) return;
    if (e.target.closest(".note")) {
      this.$modal.classList.toggle("open-modal");
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }
  openTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.id = event.target.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }
  closeTooltip(e) {
    if (!e.target.matches(".toolbar-color")) return;
    this.$colorTooltip.style.display = "none";
  }
  editNoteColor(color) {
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? { ...note, color } : note
    );
    this.render();
  }
  selectNote(e) {
    const $selectedNote = e.target.closest(".note");
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }
  closeModal() {
    this.editNote();
    this.$modal.classList.toggle("open-modal");
  }
  addNote({ title, text }) {
    const newNote = {
      title,
      text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }
  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? { ...note, title, text } : note
    );
    this.render();
  }
  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches(".toolbar-delete")) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.render();
  }
  displayNotes() {
    const hasNote = this.notes.length > 0;
    this.$placeholder.style.display = hasNote ? "none" : "flex";
    this.$notes.innerHTML = this.notes
      .map(
        note => `
        <div style="background: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" data-id=${
                note.id
              } src="./images/paint-palette.png">
              <img class="toolbar-delete" data-id=${
                note.id
              } src="./images/delete.png">
            </div>
          </div>
        </div>
     `
      )
      .join(" ");
  }
}
new App();
