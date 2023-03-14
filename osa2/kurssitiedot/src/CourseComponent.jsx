import React from "react";

function CourseComponent(props) {

  const Header = (props) => {
    return <h1>{props.course}</h1>;
  };

  const Part = (props) => {
    return (
      <p>
        {props.part} {props.exercises}
      </p>
    );
  };

  const Content = (props) => {
    return (
      <div>
        {props.parts.map((part) => (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        ))}
      </div>
    );
  };

  const Total = (props) => {
    return (
      <p>
        <b>
          Total of {props.parts.reduce((sum, part) => sum + part.exercises, 0)}{" "}
          exercises
        </b>
      </p>
    );
  };

  const Course = (props) => {
    return (
      <div>
        <Header course={props.course.name} />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts} />
      </div>
    );
  };

  const Courses = (props) => {
    return (
      <div>
        {props.courses.map((course) => (
          <Course key={course.id} course={course} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Courses courses={props.courses} />
    </div>
  );
}

export default CourseComponent;
