$(document).ready(function () {

    /* ---------- LOCAL STORAGE ---------- */
    function saveTasks() {
        const tasks = [];
        $("#todoList li .item-text").each(function () {
            tasks.push($(this).text());
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addItem(task));
    }

    /* ---------- INIT ---------- */
    $("#todoList").sortable({
        update: saveTasks
    });

    loadTasks();

    /* ---------- AUTO RESIZE TEXTAREA ---------- */
    const textarea = document.getElementById("addInput");
    textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    });

    /* ---------- ADD ---------- */
    $("#addBtn").click(function () {
        const text = $("#addInput").val().trim();
        if (!text) return;

        addItem(text);
        saveTasks();

        $("#addInput").val("");
        textarea.style.height = "3rem";
    });

    function addItem(text) {
        $("#todoList").append(`
            <li>
                <span class="item-text">${text}</span>
                <span>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </span>
            </li>
        `);
    }

    /* ---------- DELETE ---------- */
    $("#todoList").on("click", ".deleteBtn", function () {
        $(this).closest("li").remove();
        saveTasks();
    });

    /* ---------- EDIT ---------- */
    $("#todoList").on("click", ".editBtn", function () {
        const li = $(this).closest("li");
        const oldText = li.find(".item-text").text();
        const newText = prompt("Edit task:", oldText);

        if (newText && newText.trim()) {
            li.find(".item-text").text(newText);
            saveTasks();
        }
    });

    /* ---------- SEARCH ---------- */
    $("#search").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        $("#todoList li").each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

});
