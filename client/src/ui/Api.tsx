import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { config } from '@/types/config';
import {
  BASEPATH,
  extractBaseAndPath,
  extractMethodAndEndpoint,
  getApiContext,
  getParamGroupsFromAPIComponents,
  Param,
  ParamGroup,
} from '@/utils/api';
import {
  getMethodBgColor,
  getMethodBgColorWithHover,
  getMethodBorderColor,
  getMethodTextColor,
} from '@/utils/brands';

export type ApiComponent = {
  type: string;
  children?: any;
  attributes?: {
    type: string;
    name: string;
    value: string;
  }[];
};

export const APIBASE_CONFIG_STORAGE = 'apiBaseIndex';

export function Api({
  api,
  contentType = 'application/json',
  auth,
  children,
  apiComponents,
}: {
  api: string;
  contentType?: string;
  auth?: string;
  children?: any;
  apiComponents?: ApiComponent[];
}) {
  const [apiBaseIndex, setApiBaseIndex] = useState(0);
  const { method, endpoint } = extractMethodAndEndpoint(api);
  const { base, path } = extractBaseAndPath(endpoint, apiBaseIndex);

  const paramGroups = getParamGroupsFromAPIComponents(apiComponents, auth);
  const [currentActiveParamGroup, setCurrentActiveParamGroup] = useState<ParamGroup>(
    paramGroups[0]
  );
  const [isSendingRequest, setIsSendingResponse] = useState<boolean>(false);
  const [apiBase, setApiBase] = useState<string>(base);
  const [hasConfiguredApiBase, setHasConfiguredApiBase] = useState(false);
  const [inputData, setInputData] = useState<Record<string, any>>({});
  const [apiResponse, setApiResponse] = useState<string>();

  useEffect(() => {
    setHasConfiguredApiBase(window.localStorage.getItem(APIBASE_CONFIG_STORAGE) != null);

    const configuredApiBaseIndex = window.localStorage.getItem(APIBASE_CONFIG_STORAGE);
    if (configuredApiBaseIndex != null) {
      setApiBaseIndex(parseInt(configuredApiBaseIndex, 10));
    }

    // Configure api auth prefix
    // TODO: Standardize to work without auth name and reliable for different methods
    if (config.api?.auth?.inputPrefix && config.api.auth.name) {
      setInputData({
        ...inputData,
        Authorization: {
          ...inputData.Authorization,
          [config.api.auth.name]: config.api.auth.inputPrefix,
        },
      });
    }
  }, [api, children]);

  const onChangeApiBaseSelection = (base: string) => {
    if (config.api == null || !Array.isArray(config.api?.baseUrl)) {
      return;
    }
    const index = config.api.baseUrl.indexOf(base);
    window.localStorage.setItem(APIBASE_CONFIG_STORAGE, index.toString());
    setApiBase(base);
    setHasConfiguredApiBase(true);
  };

  const onChangeParam = (
    paramGroup: string,
    param: string,
    value: string | number | boolean | File
  ) => {
    setInputData({ ...inputData, [paramGroup]: { ...inputData[paramGroup], [param]: value } });
  };

  const makeApiRequest = async () => {
    setIsSendingResponse(true);

    try {
      const apiContext = getApiContext(apiBase, path, inputData, contentType);
      const { data } = await axios.post(`${BASEPATH}/api/request`, {
        method,
        ...apiContext,
      });

      setApiResponse(data.highlightedJson);
    } catch (error: any) {
      setApiResponse(error.highlightedJson);
    } finally {
      setIsSendingResponse(false);
    }
  };

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
    <div className="mt-4 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-md truncate">
      <div className="px-3 pt-3 pb-4">
        <div className="text-sm md:text-base flex items-center space-x-2">
          {method && (
            <div
              className={clsx(
                'text-white font-bold px-1.5 rounded-md text-[0.95rem]',
                getMethodBgColor(method)
              )}
            >
              {method}
            </div>
          )}
          {/* Only display dropdown when there are multiple endpoints */}
          {config.api?.baseUrl && Array.isArray(config.api?.baseUrl) && (
            <div
              className={clsx(
                'relative select-none align-middle inline-flex rounded-md -top-px mx-1 w-5 h-[1.125rem] bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border hover:border-slate-400 dark:hover:border-slate-400 focus:outline-none cursor-pointer',
                hasConfiguredApiBase
                  ? 'border-slate-400 dark:border-slate-400'
                  : 'border-slate-300 dark:border-slate-600'
              )}
            >
              <select
                aria-label="Expand api endpoint"
                aria-expanded="false"
                className="z-10 absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => onChangeApiBaseSelection(e.target.value)}
              >
                <option disabled>Select API base</option>
                {config.api.baseUrl.map((base) => (
                  <option key={base} selected={base === apiBase}>
                    {base}
                  </option>
                ))}
              </select>
              <svg
                width="20"
                height="20"
                fill="none"
                className="transform absolute -top-0.5 -left-px rotate-90"
              >
                <path
                  className="stroke-slate-700 dark:stroke-slate-100"
                  d="M9 7l3 3-3 3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          )}
          <div className="font-mono text-[0.95rem] overflow-auto">
            <span className="text-slate-700 dark:text-slate-100 font-semibold">{path}</span>
          </div>
        </div>
        <div className="text-sm">
          <div className="mt-2 block">
            <div className="border-b border-slate-200 dark:border-slate-600">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                {paramGroups.map((paramGroup: ParamGroup) => (
                  <button
                    key={paramGroup.name}
                    className={clsx(
                      currentActiveParamGroup?.name === paramGroup.name
                        ? `${getMethodTextColor(method)} ${getMethodBorderColor(method)}`
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200',
                      'whitespace-nowrap py-2 border-b-2 font-medium text-[0.84rem]'
                    )}
                    onClick={() => setCurrentActiveParamGroup(paramGroup)}
                  >
                    {paramGroup.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="mt-4 text-[0.84rem] space-y-2">
            {currentActiveParamGroup?.params.map((param) => (
              <div className="flex items-center space-x-2">
                <div className="flex-1 font-mono text-slate-600 dark:text-slate-300">
                  {param.name}
                  {param.required && <span className="text-red-600 dark:text-red-400">*</span>}
                </div>
                <div className="flex-initial w-1/3">
                  {renderInput(currentActiveParamGroup, param, param.type, param.enum)}
                </div>
              </div>
            ))}
          </div>
          <button
            className={clsx(
              'flex items-center py-1.5 px-3 rounded text-white font-medium space-x-2',
              getMethodBgColorWithHover(method),
              currentActiveParamGroup && 'mt-4'
            )}
            disabled={isSendingRequest}
            onClick={makeApiRequest}
          >
            <svg
              className="fill-white h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
            </svg>
            <div>{!isSendingRequest ? 'Send Request' : 'Sending...'}</div>
          </button>
        </div>
      </div>
      {!isSendingRequest && apiResponse && (
        <div className="py-3 px-3 max-h-48 whitespace-pre overflow-scroll border-t border-slate-200 dark:border-slate-700  dark:text-slate-300 font-mono text-xs leading-5">
          <span
            className="language-json max-h-72 overflow-scroll"
            dangerouslySetInnerHTML={{
              __html: apiResponse,
            }}
          />
        </div>
      )}
    </div>
  );
}
