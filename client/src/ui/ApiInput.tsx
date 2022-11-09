import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { Param, ParamGroup } from '@/utils/api';

const getArrayType = (type: string) => {
  if (type === 'array') {
    return '';
  }

  return type.replaceAll(/\[\]/gi, '');
};

function AddArrayItemButton({ onClick }) {
  return (
    <div className="relative">
      <button
        className="w-full py-0.5 px-2 rounded text-left border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500"
        onClick={onClick}
      >
        Add Item
      </button>
      <svg
        className="hidden sm:block absolute right-2 top-[7px] h-3 fill-slate-500 dark:fill-slate-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
      </svg>
    </div>
  );
}

export default function ApiInput({
  param,
  inputData,
  currentActiveParamGroup,
  onChangeParam,
  arrayItemIndex,
  onArrayItemChange,
  onDeleteArrayItem,
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
  arrayItemIndex?: number;
  onArrayItemChange?: (value: any) => void;
  onDeleteArrayItem?: () => void;
  path?: string[];
}) {
  const [isExpandedProperties, setIsExpandedProperties] = useState(
    Boolean(param.required) || arrayItemIndex != null
  );
  const [array, setArray] = useState<{ param: Param; value: any }[]>([]);
  const activeParamGroupName = currentActiveParamGroup.name;

  let InputField;

  // Todo: support multiple types
  let lowerCaseParamType;
  if (typeof param.type === 'string') {
    lowerCaseParamType = param.type?.toLowerCase();
  }

  const isObject = param.properties != null;
  const isArray = param.type === 'array';

  const onInputChange = (value: any) => {
    if (onArrayItemChange != null) {
      onArrayItemChange(value);
      return;
    }
    onChangeParam(activeParamGroupName, param.name, value, path);
  };

  const onArrayInputChange = (arrayIndex: number, value: any) => {
    const newArray = array.map((item, i) => {
      if (arrayIndex === i) {
        return { ...item, value };
      }
      return item;
    });
    setArray(newArray);
    onInputChange(newArray.map((item) => item.value));
  };

  const onAddArrayItem = () => {
    const newArray = [
      ...array,
      { param: { ...param, type: getArrayType(param.type) }, value: null },
    ];
    setArray(newArray);
    onInputChange(newArray.map((item) => item.value));
  };

  const onUpdateArray = (newArray: any) => {
    setArray(newArray);
    let inputValue = newArray.length > 0 ? newArray : undefined;
    onInputChange(inputValue?.map((item) => item.value));
  };

  let value = inputData[activeParamGroupName] ? inputData[activeParamGroupName][param.name] : '';
  if (value && arrayItemIndex != null) {
    value = value[arrayItemIndex];
  }

  if (lowerCaseParamType === 'boolean') {
    InputField = (
      <div className="relative">
        <select
          className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          onChange={(e) => {
            const selection = e.target.value;
            onInputChange(selection === 'true');
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
        value={value}
        onChange={(e) => onInputChange(parseInt(e.target.value, 10))}
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
            onInputChange(event.target.files[0]);
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
  } else if (isObject && !isArray) {
    InputField = arrayItemIndex == null && (
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
    InputField = array.length === 0 && <AddArrayItemButton onClick={onAddArrayItem} />;
  } else if (param.enum) {
    InputField = (
      <div className="relative">
        <select
          className="w-full py-0.5 px-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer"
          onChange={(e) => {
            const selection = e.target.value;
            onInputChange(selection);
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
          className="absolute right-2 top-[7px] h-3 fill-slate-500 dark:fill-slate-400"
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
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
      />
    );
  }

  return (
    <div
      className={clsx(
        ((isObject && isExpandedProperties) || array.length > 0) &&
          'px-3 py-2 -mx-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md'
      )}
    >
      <div className="flex items-center space-x-2 group">
        <div
          className={clsx(
            'flex items-center flex-1 font-mono text-slate-600 dark:text-slate-300',
            isObject && 'cursor-pointer',
            arrayItemIndex != null && 'invisible'
          )}
          onClick={() => isObject && setIsExpandedProperties(!isExpandedProperties)}
        >
          {param.name}
          {param.required && <span className="text-red-600 dark:text-red-400">*</span>}
        </div>
        <div
          className={clsx(
            'flex-initial',
            onDeleteArrayItem ? 'w-[calc(40%-1.05rem)] sm:w-[calc(33%-1.05rem)]' : 'w-2/5 sm:w-1/3'
          )}
        >
          {InputField}
        </div>
        {onDeleteArrayItem && (
          <button
            className="py-1 fill-red-600 dark:fill-red-400 hover:fill-red-800 dark:hover:fill-red-200"
            onClick={onDeleteArrayItem}
          >
            <svg className="h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M424 80C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H412.4L388.4 452.7C385.9 486.1 358.1 512 324.6 512H123.4C89.92 512 62.09 486.1 59.61 452.7L35.56 128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94L354.2 80H424zM177.1 48C174.5 48 171.1 49.34 170.5 51.56L151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1zM364.3 128H83.69L107.5 449.2C108.1 457.5 115.1 464 123.4 464H324.6C332.9 464 339.9 457.5 340.5 449.2L364.3 128z" />
            </svg>
          </button>
        )}
      </div>
      {/* Properties extension */}
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
      {/* Array extension */}
      {array.length > 0 && (
        <div
          className={clsx(
            'mt-1 pt-2 pb-1 space-y-2',
            !isObject && 'border-t border-slate-100 dark:border-slate-700'
          )}
        >
          {array.map((item, i) => (
            <ApiInput
              key={i}
              param={item.param}
              inputData={inputData}
              currentActiveParamGroup={currentActiveParamGroup}
              onChangeParam={onChangeParam}
              arrayItemIndex={i}
              onArrayItemChange={(value: any) => onArrayInputChange(i, value)}
              onDeleteArrayItem={() => onUpdateArray(array.filter((_, j) => i !== j))}
            />
          ))}
          <div className="flex items-center justify-end space-x-2 group">
            <div className="flex-initial w-2/5 sm:w-1/3">
              <AddArrayItemButton onClick={onAddArrayItem} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
