import type { Profile } from './profile';
import type { Community, Package } from './thunderstore';

export interface IElectronAPI {
    getProfiles: () => Promise<Profile[]>;
    saveProfiles: (profiles: Profile[]) => Promise<boolean>;
    selectFolder: () => Promise<string | null>;
    selectFile: () => Promise<string | null>;
    installMod: (profileId: string, downloadUrl: string, modName: string) => Promise<{ success: boolean; error?: string }>;
    checkDirectoryExists: (dirPath: string) => Promise<boolean>;
    fetchCommunities: () => Promise<Community[]>;
    fetchPackages: (communityIdentifier: string) => Promise<Package[]>;
    fetchPackageByName: (name: string) => Promise<Package | null>;
    importProfile: (code: string) => Promise<any>;
    importProfileFromFile: (path: string) => Promise<any>;
    openModFolder: (profileId: string, modName: string) => Promise<boolean>;
    exportProfile: (profileId: string) => Promise<{ success: boolean, path?: string }>;
}

declare global {
    interface Window {
        ipcRenderer: IElectronAPI;
    }
}
