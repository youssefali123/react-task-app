// src/api/todoService.js
const API_URL = "http://localhost:3000/todos"; // استبدل هذا بالرابط الفعلي للـ API

export async function getTodos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export async function addTodo(todo) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!res.ok) throw new Error("Failed to add todo");
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete todo");
  return true;
}

export async function updateTodo(id, updatedTodo) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH", // أو PUT لو الـ API بيدعم
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  

  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
}
