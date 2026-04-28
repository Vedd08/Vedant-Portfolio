import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    liveLink: "",
    githubLink: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      techStack: form.techStack.split(",")
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, data);
      alert("Project added");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-5">
      <h2>Admin Panel</h2>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="techStack" placeholder="React, Node, MongoDB" onChange={handleChange} />
        <input name="liveLink" placeholder="Live Link" onChange={handleChange} />
        <input name="githubLink" placeholder="GitHub Link" onChange={handleChange} />

        <button className="btn btn-primary">Add Project</button>
      </form>
    </div>
  );
}