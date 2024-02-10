import React from "react";
import { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../Components/Navbar/Navbar";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  where,
  limit,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PreviewDocument(props) {
  const { CourseCode, CourseName, Category, Semester, Year, Name, Title, URL } =
    props.doc;
  const NameWithNoSpaces = Name.replace(/\s/g, "_");
  const CourseNameWithNoSpaces = CourseName.replace(/\s/g, "_");
  const docURL = URL;

  return (
    <a href={docURL} target="_blank" rel="noreferrer" className="preview">
      <div className="aspectwrapper">
        <Document file={docURL}>
          <Page
            pageNumber={1}
            width={150}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
      <h1 className="Title">{Title}</h1>
    </a>
  );
}

function FromID(docID) {
  let docIDX = 0;
  const docRef = collection(db, "documents");
  const q = query(docRef, orderBy("CreatedAt"));
  const [docs] = useCollectionData(q);
  return (
    <div>
      {docs && docs.map((doc) => <PreviewDocument key={docIDX++} doc={doc} />)}
    </div>
  );
}

function Home() {
  const currentTheme = localStorage.getItem("currentTheme");
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  useEffect(() => {
    localStorage.setItem("currentTheme", theme);
  }, [theme]);

  return (
    <>
      <div className={"container " + theme}>
        <Navbar theme={theme} setTheme={setTheme} />
        <FromID docID="PoUKMsBST8tgXLt70OIo" />
      </div>
    </>
  );
}

export default Home;
