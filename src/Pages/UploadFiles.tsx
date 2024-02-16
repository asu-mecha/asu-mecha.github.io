import Navbar from "../Components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import algoliasearch from "algoliasearch";
import "./style.css";

const APP_ID = "E77TDAP2ZW";
const ADMIN_API_KEY = "2016061c4660d6ecc71016602c36e34e";

function Form() {
  const [progress, setProgress] = useState("");
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
    if (!file) return;
    reader.readAsDataURL(file); //start conversion...
    reader.onload = function () {
      //.. once finished..
      var rawLog = (reader.result as string).split(",")[1]; //extract only the file data part
      var dataSend = {
        dataReq: {
          data: rawLog,
          name: file.name,
          type: file.type,
          course: course,
          category: category,
          semester: semester,
        },
        fname: "uploadFilesToGoogleDrive",
      }; //preapre info to send to API
      console.log(dataSend);
      fetch(
        "https://script.google.com/macros/s/AKfycbxAgf3tkhhNdaWzRm7WJtVr2cLjjPGb8ObUHS7tkOlS5BstxR9u0-h_CunGfUyCOSs/exec",
        { method: "POST", body: JSON.stringify(dataSend) }
      ) //send to Api
        .then((res) => res.json())
        .then((a) => {
          console.log(a);
          const docRef = doc(collection(db, "documents"));
          const commonWords = ["and", "for", "but", "etc."]; // Add more common words if needed
          const semesterName = semester + " " + year;
          const data = {
            Title: title,
            Name: file.name,
            CourseName: courseName,
            CourseCode: courseCode,
            Category: category,
            Semester: semesterName,
            Year: year,
            CreatedAt: Timestamp.now(),
            Type: "Document",
            URL: a.url,
            fileID: a.id,
            Keywords: [...title.split(" "), ...courseName.split(" ")].filter(
              (word) => !commonWords.includes(word.toLowerCase())
            ),
          };

          setDoc(docRef, data);
          const client = algoliasearch(APP_ID, ADMIN_API_KEY);
          const index = client.initIndex("asu-mecha");

          const objectID = docRef.id;
          index.saveObject({ ...data, objectID });

          console.log("Document written with ID: ", docRef.id);
          setProgress("Document uploaded successfully");
        })
        .catch((e) => {
          console.log(e);
          setProgress("Error uploading document");
        }); // Or Error in console
    };

    // reader.readAsDataURL(file);
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
        <p>{progress}</p>
      </form>
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
    <div className={"container " + "upload " + theme}>
      <Navbar theme={theme} setTheme={setTheme} />
      <h1>Upload Files</h1>
      <Form />
    </div>
  );
}

export default UploadFiles;
