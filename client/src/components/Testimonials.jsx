import React from "react";
import { testimonialsData } from "../assets/assets";

const Testimonials = () => {
  return (
    <div className="mx-4 lg:mx-44 py-16">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent">
        Client Feedbacks
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto px-4 py-8">
        {testimonialsData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 drop-shadow-md max-w-lg m-auto hover:scale-105 transition-transform duration-700"
          >
            <p className="text-4xl leading-none text-neutral-300">“</p>

            <p className="mt-2 text-neutral-700">{item.text}</p>

            <div className="mt-5 flex items-center gap-3">
              <img
                src={item.image}
                alt={`${item.author} avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-neutral-800">{item.author}</p>
                <p className="text-sm text-neutral-500">
                  {item.jobTitle ?? item.jonTitle ?? ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
