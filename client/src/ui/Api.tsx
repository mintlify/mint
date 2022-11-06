import axios from 'axios';
import clsx from 'clsx';
import set from 'lodash.set';
import { useEffect, useState } from 'react';

import { config } from '@/config';
import {
  BASEPATH,
  extractBaseAndPath,
  extractMethodAndEndpoint,
  getApiContext,
  getParamGroupsFromApiComponents,
  ParamGroup,
} from '@/utils/api';
import {
  getMethodBgColor,
  getMethodBgColorWithHover,
  getMethodBorderColor,
  getMethodTextColor,
} from '@/utils/brands';

import ApiInput from './ApiInput';

export type ApiComponent = {
  type: string;
  name?: string;
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

  const paramGroupDict = getParamGroupsFromApiComponents(apiComponents, auth);
  const paramGroups = Object.entries(paramGroupDict).map(([groupName, params]) => {
    return {
      name: groupName,
      params,
    };
  });

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
    value: string | number | boolean | File,
    path: string[]
  ) => {
    console.log({ param, value });
    const newParamGroup = {
      ...inputData[paramGroup],
      ...set(inputData[paramGroup], [...path, param], value),
    };
    setInputData({ ...inputData, [paramGroup]: newParamGroup });
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

  return (
    <div className="mt-4 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-md truncate">
      <div className="px-3.5 pt-3.5 pb-4">
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
              <ApiInput
                param={param}
                inputData={inputData}
                currentActiveParamGroup={currentActiveParamGroup}
                onChangeParam={onChangeParam}
              />
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
