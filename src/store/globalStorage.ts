import localForage from 'localforage';

localForage.config({
    driver: localForage.INDEXEDDB,
    name: "spliceDb", 
    version: 1,
});

export const GlobalStorage = localForage;