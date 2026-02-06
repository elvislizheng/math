"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpectation } from "@/data/curriculum";
import { getQuestions } from "@/data/questions";
import Breadcrumb from "@/components/Breadcrumb";
import { useProgressContext } from "@/context/ProgressContext";
import { Question } from "@/types";

export default function PracticePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const result = getExpectation(code);
  const questionList = getQuestions(code);
  const { recordAnswer } = useProgressContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  if (!result || questionList.length === 0) return notFound();
  const { strand, substrand, expectation } = result;
  const question: Question = questionList[currentIndex];

  const checkAnswer = useCallback(() => {
    const userAnswer =
      question.type === "numeric-input" ? inputValue.trim() : selectedAnswer;
    const correct =
      userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setChecked(true);
    recordAnswer(code, correct);
    setResults((prev) => [...prev, correct]);
  }, [question, inputValue, selectedAnswer, code, recordAnswer]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questionList.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer("");
      setInputValue("");
      setChecked(false);
      setIsCorrect(false);
    }
  }, [currentIndex, questionList.length]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setInputValue("");
    setChecked(false);
    setIsCorrect(false);
    setResults([]);
    setFinished(false);
  }, []);

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Mathematics", href: "/" },
            {
              label: `${substrand.id}. ${substrand.name}`,
              href: `/strand/${strand.id}/${substrand.id}`,
            },
            { label: `Practice: ${code}` },
          ]}
        />
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Quiz Complete
          </h1>
          <div className="text-5xl font-bold mb-2">
            {correctCount}/{results.length}
          </div>
          <p className="text-text-secondary mb-6">
            {correctCount === results.length
              ? "Perfect score!"
              : correctCount >= results.length / 2
              ? "Good work! Keep practicing."
              : "Keep trying! Practice makes perfect."}
          </p>

          <div className="space-y-2 mb-8 max-w-md mx-auto text-left">
            {questionList.map((q, i) => (
              <div
                key={q.id}
                className={`px-4 py-2 rounded text-sm ${
                  results[i]
                    ? "bg-success-bg text-success"
                    : "bg-error-bg text-error"
                }`}
              >
                Q{i + 1}: {results[i] ? "Correct" : "Incorrect"}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="bg-teal text-white px-5 py-2 rounded font-medium hover:bg-teal-hover transition-colors"
            >
              Try Again
            </button>
            <Link
              href={`/strand/${strand.id}/${substrand.id}`}
              className="border border-border-gray text-text-primary px-5 py-2 rounded font-medium hover:bg-bg-gray transition-colors"
            >
              Back to Expectations
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Mathematics", href: "/" },
          {
            label: `${substrand.id}. ${substrand.name}`,
            href: `/strand/${strand.id}/${substrand.id}`,
          },
          { label: `Practice: ${code}` },
        ]}
      />

      <div className="mb-4">
        <h1 className="text-lg font-bold text-text-primary mb-1">
          {expectation.code} — {expectation.title}
        </h1>
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-border-gray rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / questionList.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs text-text-muted">
            {currentIndex + 1} / {questionList.length}
          </span>
        </div>
      </div>

      <div className="bg-bg-white border border-border-gray rounded-lg p-6">
        <p className="text-base font-medium text-text-primary mb-5">
          {question.question}
        </p>

        {/* Multiple choice */}
        {question.type === "multiple-choice" && question.choices && (
          <div className="space-y-2 mb-5">
            {question.choices.map((choice) => {
              const isSelected = selectedAnswer === choice;
              let style = "border-border-gray hover:border-teal";
              if (checked && isSelected) {
                style = isCorrect
                  ? "border-success bg-success-bg"
                  : "border-error bg-error-bg";
              } else if (
                checked &&
                choice === question.correctAnswer
              ) {
                style = "border-success bg-success-bg";
              } else if (isSelected) {
                style = "border-teal bg-teal/5";
              }
              return (
                <button
                  key={choice}
                  disabled={checked}
                  onClick={() => setSelectedAnswer(choice)}
                  className={`w-full text-left px-4 py-3 rounded border-2 text-sm transition-colors ${style}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        )}

        {/* True/False */}
        {question.type === "true-false" && (
          <div className="flex gap-3 mb-5">
            {["True", "False"].map((opt) => {
              const isSelected = selectedAnswer === opt;
              let style =
                "border-border-gray hover:border-teal text-text-primary";
              if (checked && isSelected) {
                style = isCorrect
                  ? "border-success bg-success-bg text-success"
                  : "border-error bg-error-bg text-error";
              } else if (
                checked &&
                opt === question.correctAnswer
              ) {
                style = "border-success bg-success-bg text-success";
              } else if (isSelected) {
                style = "border-teal bg-teal/5 text-teal";
              }
              return (
                <button
                  key={opt}
                  disabled={checked}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`flex-1 px-4 py-3 rounded border-2 text-sm font-medium transition-colors ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Numeric input */}
        {question.type === "numeric-input" && (
          <div className="mb-5">
            <input
              type="text"
              disabled={checked}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !checked && inputValue.trim())
                  checkAnswer();
              }}
              placeholder="Type your answer..."
              className={`w-full max-w-xs px-4 py-3 rounded border-2 text-sm outline-none transition-colors ${
                checked
                  ? isCorrect
                    ? "border-success bg-success-bg"
                    : "border-error bg-error-bg"
                  : "border-border-gray focus:border-teal"
              }`}
            />
          </div>
        )}

        {/* Feedback */}
        {checked && (
          <div
            className={`p-4 rounded mb-4 text-sm ${
              isCorrect ? "bg-success-bg text-success" : "bg-error-bg text-error"
            }`}
          >
            <p className="font-bold mb-1">
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            {!isCorrect && (
              <p className="mb-1">
                The correct answer is:{" "}
                <span className="font-semibold">{question.correctAnswer}</span>
              </p>
            )}
            <p className="text-text-secondary">{question.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!checked ? (
            <button
              onClick={checkAnswer}
              disabled={
                question.type === "numeric-input"
                  ? !inputValue.trim()
                  : !selectedAnswer
              }
              className="bg-teal text-white px-5 py-2 rounded font-medium hover:bg-teal-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-teal text-white px-5 py-2 rounded font-medium hover:bg-teal-hover transition-colors"
            >
              {currentIndex + 1 >= questionList.length
                ? "See Results"
                : "Next Question"}
            </button>
          )}
        </div>
      </div>

      {question.hint && !checked && (
        <p className="mt-3 text-xs text-text-muted italic">
          Hint: {question.hint}
        </p>
      )}
    </>
  );
}
