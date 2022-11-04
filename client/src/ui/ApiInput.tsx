import clsx from 'clsx';

import { Param, ParamGroup } from '@/utils/api';

export default function ApiInput({
  param,
  inputData,
  currentActiveParamGroup,
  onChangeParam,
}: {
  param: Param;
  inputData: Record<string, any>;
  currentActiveParamGroup: ParamGroup;
  onChangeParam: (
    paramGroup: string,
    param: string,
    value: string | number | boolean | File
  ) => void;
}) {
  const renderInput = (
    paramGroup: ParamGroup,
    param: Param,
    type?: string,
    enumValues?: string[]
  ) => {
    switch (type?.toLowerCase()) {
      case 'boolean':
        return (
          <div className="relative">
            <select
              className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              onChange={(e) => {
                const selection = e.target.value;
                if (selection === 'true') {
                  onChangeParam(paramGroup.name, param.name, true);
                } else {
                  onChangeParam(paramGroup.name, param.name, false);
                }
              }}
            >
              <option disabled selected>
                Select
              </option>
              <option>true</option>
              <option>false</option>
            </select>
            <svg
              className="absolute right-2 top-[7px] h-3 fill-slate-600 dark:fill-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" />
            </svg>
          </div>
        );
      case 'integer':
      case 'number':
        return (
          <input
            className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            type="number"
            placeholder={param.placeholder}
            value={inputData[paramGroup.name] ? inputData[paramGroup.name][param.name] : ''}
            onChange={(e) =>
              onChangeParam(paramGroup.name, param.name, parseInt(e.target.value, 10))
            }
          />
        );
      case 'file':
      case 'files':
        return (
          <button className="relative flex items-center px-2 w-full h-7 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-dashed hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              className="z-10 absolute inset-0 opacity-0 cursor-pointer"
              type="file"
              onChange={(event) => {
                if (event.target.files == null) {
                  return;
                }

                onChangeParam(paramGroup.name, param.name, event.target.files[0]);
              }}
            />
            <svg
              className="absolute right-2 top-[7px] h-3 fill-slate-500 dark:fill-slate-400 bg-border-slate-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M105.4 182.6c12.5 12.49 32.76 12.5 45.25 .001L224 109.3V352c0 17.67 14.33 32 32 32c17.67 0 32-14.33 32-32V109.3l73.38 73.38c12.49 12.49 32.75 12.49 45.25-.001c12.49-12.49 12.49-32.75 0-45.25l-128-128C272.4 3.125 264.2 0 256 0S239.6 3.125 233.4 9.375L105.4 137.4C92.88 149.9 92.88 170.1 105.4 182.6zM480 352h-160c0 35.35-28.65 64-64 64s-64-28.65-64-64H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456z" />
            </svg>
            {inputData[paramGroup.name] != null &&
            inputData[paramGroup.name][param.name] != null ? (
              <span className="w-full truncate">{inputData[paramGroup.name][param.name].name}</span>
            ) : (
              'Choose file'
            )}
          </button>
        );
      case 'object':
        return (
          <button className="relative flex items-center px-2 w-full h-7 rounded border border-dashed border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:border-slate-400 hover:text-slate-700 dark:hover:border-slate-400 dark:hover:text-slate-200">
            Show properties
          </button>
        );
      default:
        if (enumValues) {
          return (
            <div className="relative">
              <select
                className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                onChange={(e) => {
                  const selection = e.target.value;
                  onChangeParam(paramGroup.name, param.name, selection);
                }}
              >
                <option disabled selected>
                  Select
                </option>
                {enumValues.map((enumValue) => (
                  <option>{enumValue}</option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-[7px] h-3 fill-slate-600 dark:fill-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" />
              </svg>
            </div>
          );
        }
        return (
          <input
            className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            type="text"
            placeholder={param.placeholder}
            value={inputData[paramGroup.name] ? inputData[paramGroup.name][param.name] : ''}
            onChange={(e) => onChangeParam(paramGroup.name, param.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center flex-1 font-mono text-slate-600 dark:text-slate-300">
        {param.name}
        {param.required && <span className="text-red-600 dark:text-red-400">*</span>}
        {param.type === 'object' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx('h-3 w-3', false && 'rotate-90 -mt-1')}
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
          </svg>
        )}
      </div>
      <div className="flex-initial w-1/3">
        {renderInput(currentActiveParamGroup, param, param.type, param.enum)}
      </div>
    </div>
  );
}
