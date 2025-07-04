// Final curated Internship Tracker: with streak visual, reminders, full task rendering, notes section, updated streak
import React, { useEffect, useState } from "react";

const startDate = new Date("2025-07-04");
const endDate = new Date("2025-08-04");

export default function InternshipPrepSchedule() {
  const [checkedBoxes, setCheckedBoxes] = useState(() => {
    const saved = localStorage.getItem("internshipRoutineChecks");
    return saved ? JSON.parse(saved) : {};
  });

  const [dailyNotes, setDailyNotes] = useState(() => {
    const saved = localStorage.getItem("dailyNotes");
    return saved ? JSON.parse(saved) : {};
  });

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem("topics");
    return saved ? JSON.parse(saved) : {};
  });

  const [dsaCount, setDsaCount] = useState(() => {
    const saved = localStorage.getItem("dsaCount");
    return saved ? JSON.parse(saved) : {};
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streakData");
    return saved ? JSON.parse(saved) : { total: 0, history: [] };
  });

  const today = new Date().toISOString().split("T")[0];
  const days = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  useEffect(() => {
    localStorage.setItem("internshipRoutineChecks", JSON.stringify(checkedBoxes));
  }, [checkedBoxes]);

  useEffect(() => {
    localStorage.setItem("dailyNotes", JSON.stringify(dailyNotes));
  }, [dailyNotes]);

  useEffect(() => {
    localStorage.setItem("topics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem("dsaCount", JSON.stringify(dsaCount));
  }, [dsaCount]);

  useEffect(() => {
    localStorage.setItem("streakData", JSON.stringify(streak));
  }, [streak]);

  const handleCheckboxChange = (date, task) => {
    const key = `${date}-${task}`;
    setCheckedBoxes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNoteChange = (date, text) => {
    setDailyNotes((prev) => ({ ...prev, [date]: text }));
  };

  const handleTopicChange = (date, field, text) => {
    setTopics((prev) => ({
      ...prev,
      [date]: { ...prev[date], [field]: text },
    }));
  };

  const handleDsaCountChange = (date, count) => {
    const val = parseInt(count) || 0;
    setDsaCount((prev) => ({ ...prev, [date]: val }));
  };

  const calculateDailyCompletion = (date) => {
    const tasks = ["Wake", "DSA1", "DSA2", "DSA3", "DSA4", "DSA5", "Web1", "Web2", "Web3", "Web4", "Rev1", "Rev2", "Rev3", "Rev4", "Core1", "Core2", "Core3", "Nap"];
    const total = tasks.length;
    const completed = tasks.filter((t) => checkedBoxes[`${date}-${t}`]).length;
    return Math.round((completed / total) * 100);
  };

  const handleEndDay = (date) => {
    const percentage = calculateDailyCompletion(date);
    const solved = dsaCount[date] || 0;
    const msg = percentage >= 80 && solved >= 8
      ? "✔️ Great job! Streak continued."
      : "❌ WASTED ANOTHER DAY, INTERN AISE KAISE LAGEGI KHUSHI";

    alert(msg);

    setStreak((prev) => ({
      total: percentage >= 80 && solved >= 8 ? prev.total + 1 : prev.total,
      history: [...prev.history, { date, status: msg }],
    }));
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-yellow-300 mb-1 animate-pulse">🚨 Khushi - Future Intern @ MAANG & FAANG 💼</h1>
      <h2 className="text-lg font-semibold text-center text-red-400 mb-3 animate-bounce">This is your only chance, don’t waste it. Stay consistent! 💪</h2>

      <div className="text-center mb-6">
        <span className="bg-green-500 text-black px-4 py-2 rounded-full font-bold shadow-xl">🔥 Current Streak: {streak.total} Days</span>
      </div>

      <div className="space-y-8">
        {days.map((day) => {
          const dateKey = day.toISOString().split("T")[0];
          const todayTopics = topics[dateKey] || {};

          return (
            <div key={dateKey} className="bg-gray-800 p-4 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-3 text-pink-400">📅 {day.toDateString()}</h2>

              <div className="space-y-2">
                <div>
                  <label className="mr-2">✅ Woke up?</label>
                  <input type="checkbox" className="accent-green-400" checked={checkedBoxes[`${dateKey}-Wake`] || false} onChange={() => handleCheckboxChange(dateKey, "Wake")} />
                </div>

                <div>
                  <label>📚 DSA Topic:</label>
                  <input className="text-black ml-2 px-2 py-1 rounded w-full max-w-xl" value={todayTopics.dsa || ""} onChange={(e) => handleTopicChange(dateKey, "dsa", e.target.value)} />
                  <div className="mt-1">{[...Array(5)].map((_, i) => (
                    <input key={i} type="checkbox" className="accent-blue-400 mx-1" checked={checkedBoxes[`${dateKey}-DSA${i + 1}`] || false} onChange={() => handleCheckboxChange(dateKey, `DSA${i + 1}`)} />
                  ))}</div>
                </div>

                <div>
                  <label>💻 Web Dev Topic:</label>
                  <input className="text-black ml-2 px-2 py-1 rounded w-full max-w-xl" value={todayTopics.web || ""} onChange={(e) => handleTopicChange(dateKey, "web", e.target.value)} />
                  <div className="mt-1">{[...Array(4)].map((_, i) => (
                    <input key={i} type="checkbox" className="accent-yellow-400 mx-1" checked={checkedBoxes[`${dateKey}-Web${i + 1}`] || false} onChange={() => handleCheckboxChange(dateKey, `Web${i + 1}`)} />
                  ))}</div>
                </div>

                <div>
                  <label>🔁 DSA Revision:</label>
                  <input className="text-black ml-2 px-2 py-1 rounded w-full max-w-xl" value={todayTopics.rev || ""} onChange={(e) => handleTopicChange(dateKey, "rev", e.target.value)} />
                  <div className="mt-1">{[...Array(4)].map((_, i) => (
                    <input key={i} type="checkbox" className="accent-purple-400 mx-1" checked={checkedBoxes[`${dateKey}-Rev${i + 1}`] || false} onChange={() => handleCheckboxChange(dateKey, `Rev${i + 1}`)} />
                  ))}</div>
                </div>

                <div>
                  <label>🧠 Core Fundamentals:</label>
                  <input className="text-black ml-2 px-2 py-1 rounded w-full max-w-xl" value={todayTopics.core || ""} onChange={(e) => handleTopicChange(dateKey, "core", e.target.value)} />
                  <div className="mt-1">{[...Array(3)].map((_, i) => (
                    <input key={i} type="checkbox" className="accent-green-400 mx-1" checked={checkedBoxes[`${dateKey}-Core${i + 1}`] || false} onChange={() => handleCheckboxChange(dateKey, `Core${i + 1}`)} />
                  ))}</div>
                </div>

                <div>
                  <label className="mr-2">😴 Nap Taken?</label>
                  <input type="checkbox" className="accent-pink-400" checked={checkedBoxes[`${dateKey}-Nap`] || false} onChange={() => handleCheckboxChange(dateKey, "Nap")} />
                </div>

                <div>
                  <label className="mr-2">🧮 DSA Questions Solved:</label>
                  <input type="number" className="text-black px-2 py-1 rounded w-24" value={dsaCount[dateKey] || 0} onChange={(e) => handleDsaCountChange(dateKey, e.target.value)} />
                  {dsaCount[dateKey] >= 8 && <span className="ml-3 text-red-400">❤️ Goal Met</span>}
                </div>

                <div className="mt-2">
                  <textarea placeholder="📝 Notes..." className="w-full p-2 text-black rounded" rows={3} value={dailyNotes[dateKey] || ""} onChange={(e) => handleNoteChange(dateKey, e.target.value)}></textarea>
                </div>

                <button className="mt-3 px-4 py-2 bg-yellow-400 text-black rounded font-bold" onClick={() => handleEndDay(dateKey)}>✅ End Day</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
