import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { Param, ParamGroup } from '@/utils/api';

export default function ApiInput({
  param,
  inputData,
  currentActiveParamGroup,
  onChangeParam,
  path = [],
}: {
  param: Param;
  inputData: Record<string, any>;
  currentActiveParamGroup: ParamGroup;
  onChangeParam: (
    paramGroup: string,
    param: string,
    value: string | number | boolean | File,
    path: string[]
  ) => void;
  path?: string[];
}) {
  const [isExpandedProperties, setIsExpandedProperties] = useState(Boolean(param.required));
  const activeParamGroupName = currentActiveParamGroup.name;

  let InputField;

  // Todo: support multiple types
  let lowerCaseParamType;
  if (typeof param.type === 'string') {
    lowerCaseParamType = param.type?.toLowerCase();
  }
  const isObject = param.properties;

  if (lowerCaseParamType === 'boolean') {
    InputField = (
      <div className="relative">
        <select
          className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          onChange={(e) => {
            const selection = e.target.value;
            if (selection === 'true') {
              onChangeParam(activeParamGroupName, param.name, true, path);
            } else {
              onChangeParam(activeParamGroupName, param.name, false, path);
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
  } else if (lowerCaseParamType === 'integer' || lowerCaseParamType === 'number') {
    InputField = (
      <input
        className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
        type="number"
        placeholder={param.placeholder}
        value={inputData[activeParamGroupName] ? inputData[activeParamGroupName][param.name] : ''}
        onChange={(e) =>
          onChangeParam(activeParamGroupName, param.name, parseInt(e.target.value, 10), path)
        }
      />
    );
  } else if (lowerCaseParamType === 'file' || lowerCaseParamType === 'files') {
    InputField = (
      <button className="relative flex items-center px-2 w-full h-7 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-dashed hover:bg-slate-50 dark:hover:bg-slate-800">
        <input
          className="z-10 absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          onChange={(event) => {
            if (event.target.files == null) {
              return;
            }
            onChangeParam(activeParamGroupName, param.name, event.target.files[0], path);
          }}
        />
        <svg
          className="absolute right-2 top-[7px] h-3 fill-slate-500 dark:fill-slate-400 bg-border-slate-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M105.4 182.6c12.5 12.49 32.76 12.5 45.25 .001L224 109.3V352c0 17.67 14.33 32 32 32c17.67 0 32-14.33 32-32V109.3l73.38 73.38c12.49 12.49 32.75 12.49 45.25-.001c12.49-12.49 12.49-32.75 0-45.25l-128-128C272.4 3.125 264.2 0 256 0S239.6 3.125 233.4 9.375L105.4 137.4C92.88 149.9 92.88 170.1 105.4 182.6zM480 352h-160c0 35.35-28.65 64-64 64s-64-28.65-64-64H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456z" />
        </svg>
        {inputData[activeParamGroupName] != null &&
        inputData[activeParamGroupName][param.name] != null ? (
          <span className="w-full truncate">
            {inputData[activeParamGroupName][param.name].name}
          </span>
        ) : (
          'Choose file'
        )}
      </button>
    );
  } else if (isObject) {
    InputField = (
      <button
        className="relative flex items-center w-full h-6 justify-end "
        onClick={() => setIsExpandedProperties(!isExpandedProperties)}
      >
        <span className="fill-slate-500 dark:fill-slate-400 group-hover:fill-slate-700 dark:group-hover:fill-slate-200">
          {isExpandedProperties ? (
            <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M473 7c-9.4-9.4-24.6-9.4-33.9 0l-87 87L313 55c-6.9-6.9-17.2-8.9-26.2-5.2S272 62.3 272 72V216c0 13.3 10.7 24 24 24H440c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-39-39 87-87c9.4-9.4 9.4-24.6 0-33.9L473 7zM216 272H72c-9.7 0-18.5 5.8-22.2 14.8s-1.7 19.3 5.2 26.2l39 39L7 439c-9.4 9.4-9.4 24.6 0 33.9l32 32c9.4 9.4 24.6 9.4 33.9 0l87-87 39 39c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2V296c0-13.3-10.7-24-24-24z" />
            </svg>
          ) : (
            <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM184 496H40c-13.3 0-24-10.7-24-24V328c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z" />
            </svg>
          )}
        </span>
      </button>
    );
  } else if (param.enum) {
    InputField = (
      <div className="relative">
        <select
          className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          onChange={(e) => {
            const selection = e.target.value;
            onChangeParam(activeParamGroupName, param.name, selection, path);
          }}
        >
          <option disabled selected>
            Select
          </option>
          {param.enum.map((enumValue) => (
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
  } else {
    InputField = (
      <input
        className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
        type="text"
        placeholder={param.placeholder}
        value={inputData[activeParamGroupName] ? inputData[activeParamGroupName][param.name] : ''}
        onChange={(e) => onChangeParam(activeParamGroupName, param.name, e.target.value, path)}
      />
    );
  }

  return (
    <div
      className={clsx(
        isObject &&
          isExpandedProperties &&
          'px-3 py-2 -mx-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md'
      )}
    >
      <div className="flex items-center space-x-2 group">
        <div
          className={clsx(
            'flex items-center flex-1 font-mono text-slate-600 dark:text-slate-300',
            isObject && 'cursor-pointer'
          )}
          onClick={() => isObject && setIsExpandedProperties(!isExpandedProperties)}
        >
          {param.name}
          {param.required && <span className="text-red-600 dark:text-red-400">*</span>}
        </div>
        <div className="flex-initial w-1/3">{InputField}</div>
      </div>
      {isExpandedProperties && param.properties && (
        <div className="mt-1 pt-2 pb-1 border-t border-slate-100 dark:border-slate-700 space-y-2">
          {param.properties.map((property) => (
            <ApiInput
              key={property.name}
              param={property}
              inputData={inputData}
              currentActiveParamGroup={currentActiveParamGroup}
              onChangeParam={onChangeParam}
              path={[...path, param.name]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
