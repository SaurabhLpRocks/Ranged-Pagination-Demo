import { FilterMetadata } from 'primeng/components/common/filtermetadata';

export interface FilterEvent {
    filteredValue: any[];
    filters?: {
        [s: string]: FilterMetadata;
    };
}
