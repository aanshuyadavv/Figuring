import React from "react";

const CodeBox = () => {
  return (
    <div className="w-[95%] sm:w-[46%] bg-black text-xs sm:text-sm p-3 sm:p-4 font-mono space-y-1 rounded-md shadow-lg mx-auto">
      {[
        ['&lt;!DOCTYPE html&gt;', 'text-yellow-300'],
        ['&lt;html lang="en"&gt;', 'text-white'],
        ['&lt;head&gt;', 'text-white'],
        ['&lt;meta charset="UTF-8"&gt;', 'text-white'],
        [
          '&lt;meta <span class="text-red-500">http-equiv="X-UA-Compatible" content="IE=edge"&gt;</span>',
          'text-white',
        ],
        [
          '&lt;title&gt;<span class="text-red-500"> Ed Tech </span>&lt;/title&gt;',
          'text-white',
        ],
        ['&lt;/head&gt;', 'text-white'],
        ['&lt;body&gt;', 'text-white'],
        [
          '&lt;h1&gt;<span class="text-red-500">Welcome to Ed Tech </span>&lt;/h1&gt;',
          'text-white',
        ],
        [
          '&lt;p&gt;<span class="text-red-500"> Learn and grow with cutting-edge technology and education.</span>&lt;/p&gt;',
          'text-white',
        ],
        ['&lt;/body&gt;', 'text-white'],
        ['&lt;/html&gt;', 'text-white'],
      ].map(([code, color], index) => (
        <div
          key={index}
          className="flex gap-2 code-line px-2 py-[1px] rounded-md"
        >
          <span className="text-gray-500 w-6">{index + 1}</span>
          <span
            className={`typewriter ${color}`}
            dangerouslySetInnerHTML={{ __html: code }}
          />
        </div>
      ))}
    </div>
  );
};

export default CodeBox;
