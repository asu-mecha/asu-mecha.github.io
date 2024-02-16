import Navbar from "../Components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Document, Page, pdfjs } from "react-pdf";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import algoliasearch from "algoliasearch";
import "./style.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const APP_ID = "E77TDAP2ZW";
const ADMIN_API_KEY = "2016061c4660d6ecc71016602c36e34e";

function Form() {
  const [pdfURL, setPdfURL] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = (e.target as any)?.[0].files[0];
    const title = (e.target as any)?.[1]?.value as string;
    const course = (e.target as any)?.[2]?.value as string;
    const courseCode = course.split("-")[0];
    const courseName = course.split("-")[1];
    const category = (e.target as any)?.[3]?.value;
    const semester = (e.target as any)?.[4]?.value;
    const year = (e.target as any)?.[5]?.value;
    const reader = new FileReader();
    console.log(
      title,
      course,
      category,
      semester,
      year,
      file?.name,
      file?.size
    );

    if (!file) return;

    const storageRef = ref(
      storage,
      `documents/${course}/${category}/${semester}${year}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
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
          const docRef = doc(collection(db, "documents"));
          const commonWords = ["and", "for", "but", "etc."]; // Add more common words if needed

          const data = {
            Title: title,
            Name: file.name,
            CourseName: courseName,
            CourseCode: courseCode,
            Category: category,
            Semester: semester,
            Year: year,
            CreatedAt: Timestamp.now(),
            Type: "Document",
            URL: downloadURL,
            Keywords: [...title.split(" "), ...courseName.split(" ")].filter(
              (word) => !commonWords.includes(word.toLowerCase())
            ),
          };

          setDoc(docRef, data);
          const client = algoliasearch(APP_ID, ADMIN_API_KEY);
          const index = client.initIndex("asu-mecha");

          const objectID = docRef.id;
          index.saveObject({ ...data, objectID });
        });
      }
    );

    reader.readAsDataURL(file);
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="uploadform">
        <input type="file" />
        <input type="text" placeholder="Title" />
        <label htmlFor="course">Choose a Course:</label>
        <select name="course">
          <option value="MDP251-Casting and Welding">
            MDP251-Casting and Welding
          </option>
          <option value="MDP231-Engineering Economy">
            MDP231-Engineering Economy
          </option>
          <option value="MDP232-Industrial Project Management">
            MDP232-Industrial Project Management
          </option>
          <option value="MDP212-Mechanics of Machines">
            MDP212-Mechanics of Machines
          </option>
          <option value="MCT232-Electronics for Instrumentation">
            MCT232-Electronics for Instrumentation
          </option>
          <option value="MEP221-Fluid Mechanics and Turbo-Machinery">
            MEP221-Fluid Mechanics and Turbo-Machinery
          </option>
          <option value="NA-Others">Others</option>
        </select>
        <label htmlFor="category">Choose a Category:</label>
        <select name="category">
          <option value="Lecture Slides">Lecture Slides</option>
          <option value="Assignments">Assignments</option>
          <option value="Final Exams">Final Exams</option>
          <option value="Midterm Exams">Midterm Exams</option>
          <option value="Quizzes">Quizzes</option>
          <option value="Projects">Projects</option>
          <option value="Labs">Labs</option>
          <option value="Tutorials">Tutorials</option>
          <option value="Solutions">Solutions</option>
          <option value="References">References</option>
          <option value="Others">Others</option>
        </select>
        <label htmlFor="semester">Choose a Semester:</label>
        <select name="semester">
          <option value="Fall">Fall</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
        </select>
        <label htmlFor="year">Choose a Year:</label>
        <select name="year">
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
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
