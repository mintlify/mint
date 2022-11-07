import clsx from 'clsx';
import { useState } from 'react';

import { Param, ParamGroup } from '@/utils/api';

export default function ApiInput({
  param,
  inputData,
  currentActiveParamGroup,
  onChangeParam,
  path = [],
  onDelete,
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
  onDelete?: () => void;
}) {
  const [isExpandedProperties, setIsExpandedProperties] = useState(true);
  const [inputArray, setInputArray] = useState<Param[]>([]);
  const activeParamGroupName = currentActiveParamGroup.name;

  let InputField;

  // Todo: support multiple types
  let lowerCaseParamType;
  if (typeof param.type === 'string') {
    lowerCaseParamType = param.type?.toLowerCase();
  }
  const isObject = param.properties;
  const isArray =
    lowerCaseParamType === 'array' ||
    (lowerCaseParamType?.includes('[') && lowerCaseParamType.includes(']'));

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
  } else if (isArray) {
    if (inputArray.length === 0) {
      InputField = (
        <span className="relative flex items-center w-full h-6 justify-end fill-slate-500 dark:fill-slate-400 space-x-1.5">
          <button
            className="hover:fill-slate-700 dark:hover:fill-slate-200"
            onClick={() => setInputArray([...inputArray, { name: '' }])}
          >
            <svg className="h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
            </svg>
          </button>
        </span>
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

  const deleteFirstArrayField = () => {
    setInputArray([...inputArray.slice(1, inputArray.length)]);
  };

  const shouldShowDelete = onDelete || (isArray && inputArray.length > 0);
  const onDeleteArrayField = onDelete || deleteFirstArrayField;
  return (
    <div
      className={clsx(
        ((isObject && isExpandedProperties) || inputArray.length > 0) &&
          'px-2 py-2 -mx-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md'
      )}
    >
      <div className={clsx('flex items-center space-x-2 group')}>
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
        <div className={clsx('flex-initial', shouldShowDelete ? 'w-[calc(33%-1.25rem)]' : 'w-1/3')}>
          {InputField}
        </div>
        {shouldShowDelete && (
          <button
            className="fill-red-500 dark:fill-red-400 hover:fill-red-700 dark:hover:fill-red-200"
            onClick={onDeleteArrayField}
          >
            <svg className="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" />
            </svg>
          </button>
        )}
      </div>
      {isExpandedProperties && param.properties && (
        <div className="mt-1 pt-2 pb-1 border-t border-slate-100 dark:border-slate-700 space-y-2">
          {param.properties.map((property) => (
            <ApiInput
              param={property}
              inputData={inputData}
              currentActiveParamGroup={currentActiveParamGroup}
              onChangeParam={onChangeParam}
              path={[...path, param.name]}
            />
          ))}
        </div>
      )}
      {inputArray.length > 0 && (
        <div className="pt-2 pb-1 space-y-2">
          {inputArray.slice(1).map((input, i) => (
            <ApiInput
              param={input}
              inputData={inputData}
              currentActiveParamGroup={currentActiveParamGroup}
              onChangeParam={onChangeParam}
              onDelete={() =>
                setInputArray([
                  ...inputArray.slice(0, i),
                  ...inputArray.slice(i + 1, inputArray.length),
                ])
              }
            />
          ))}
          <span className="relative flex items-center w-full h-5 justify-end fill-slate-500 dark:fill-slate-400">
            <button
              className="hover:fill-slate-700 dark:hover:fill-slate-200"
              onClick={() => setInputArray([...inputArray, { name: '' }])}
            >
              <svg className="h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
