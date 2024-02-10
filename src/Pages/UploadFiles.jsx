import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Document, Page, pdfjs } from "react-pdf";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import "./style.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Form() {
  const [pdfURL, setPdfURL] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    const title = e.target[1]?.value;
    const course = e.target[2]?.value;
    const courseCode = course.split("-")[0];
    const courseName = course.split("-")[1];
    const category = e.target[3]?.value;
    const semester = e.target[4]?.value;
    const year = e.target[5]?.value;
    const reader = new FileReader();
    console.log(title, course, category, semester, year, file.name, file.size);

    if (!file) return;

    const storageRef = ref(
      storage,
      `documents/${course}/${category}/${semester}${year}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = parseInt(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPdfURL(downloadURL);
        });
      }
    );

    const docRef = doc(collection(db, "documents"));
    setDoc(docRef, {
      Title: title,
      Name: file.name,
      CourseName: courseName,
      CourseCode: courseCode,
      Category: category,
      Semester: semester,
      Year: year,
      CreatedAt: Timestamp.now(),
      Type: "Document",
      URL: pdfURL,
    });
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" />
        <input type="text" placeholder="Title" />
        <label htmlFor="course">Choose a Course:</label>
        <select name="course">
          <option value="CSE111-Logic Design">CSE111-Logic Design</option>
          <option value="CSE222-Prog">CSE222-Prog</option>
          <option value="option3">Option 3</option>
        </select>
        <label htmlFor="category">Choose a Category:</label>
        <select name="category">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <label htmlFor="semester">Choose a Semester:</label>
        <select name="semester">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <label htmlFor="year">Choose a Year:</label>
        <select name="year">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <button type="submit">Upload</button>
      </form>
      {!pdfURL && (
        <div className="outerbar">
          <div className="innerbar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
      {pdfURL && (
        <a
          href={pdfURL}
          target="_blank"
          rel="noreferrer"
          className="aspectwrapper"
        >
          <Document file={pdfURL}>
            <Page pageNumber={1} width={200} />
          </Document>
        </a>
      )}
    </div>
  );
}

function UploadFiles() {
  const currentTheme = localStorage.getItem("currentTheme");
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  useEffect(() => {
    localStorage.setItem("currentTheme", theme);
  }, [theme]);

  return (
    <div className={"container " + theme}>
      <Navbar theme={theme} setTheme={setTheme} />
      <h1>Upload Files</h1>
      <Form />
    </div>
  );
}

export default UploadFiles;
