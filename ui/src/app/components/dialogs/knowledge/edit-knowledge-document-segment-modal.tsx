import { useState } from 'react';
import type {
  BaseResponse,
  KnowledgeDocumentSegment,
  ServiceError,
} from '@rapidaai/react';
import { Checkmark } from '@carbon/icons-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  PrimaryButton,
  SecondaryButton,
  Stack,
  TextInput,
} from '@/app/components/ui/primitives';
import { Notification } from '@/app/components/ui/feedback';
import { useCurrentCredential } from '@/hooks/use-credential';
import { updateKnowledgeDocumentSegmentEntities } from '@/clients';

type SegmentEntityKey =
  | 'documentName'
  | 'organizations'
  | 'dates'
  | 'products'
  | 'events'
  | 'industries'
  | 'locations'
  | 'people'
  | 'times'
  | 'quantities';

const SEGMENT_ENTITY_FIELDS: Array<{
  key: SegmentEntityKey;
  label: string;
  placeholder: string;
}> = [
  {
    key: 'documentName',
    label: 'Document Name',
    placeholder: 'Enter document name',
  },
  {
    key: 'organizations',
    label: 'Organizations',
    placeholder: 'Enter organizations separated by commas',
  },
  {
    key: 'dates',
    label: 'Dates',
    placeholder: 'Enter dates separated by commas',
  },
  {
    key: 'products',
    label: 'Products',
    placeholder: 'Enter products separated by commas',
  },
  {
    key: 'events',
    label: 'Events',
    placeholder: 'Enter events separated by commas',
  },
  {
    key: 'industries',
    label: 'Industries',
    placeholder: 'Enter industries separated by commas',
  },
  {
    key: 'locations',
    label: 'Locations',
    placeholder: 'Enter locations separated by commas',
  },
  {
    key: 'people',
    label: 'People',
    placeholder: 'Enter people separated by commas',
  },
  {
    key: 'times',
    label: 'Times',
    placeholder: 'Enter times separated by commas',
  },
  {
    key: 'quantities',
    label: 'Quantities',
    placeholder: 'Enter quantities separated by commas',
  },
];

export const parseSegmentEntityList = (entityString: string): string[] =>
  entityString
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '');

interface EditKnowledgeDocumentSegmentDialogProps {
  segment: KnowledgeDocumentSegment;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditKnowledgeDocumentSegmentDialog({
  segment,
  onClose,
  onUpdate,
}: EditKnowledgeDocumentSegmentDialogProps) {
  const { authId, token, projectId } = useCurrentCredential();
  const [error, setError] = useState('');
  const [entities, setEntities] = useState({
    documentName: segment?.getMetadata()?.getDocumentName() || '',
    organizations:
      segment.getEntities()?.getOrganizationsList()?.join(', ') || '',
    dates: segment.getEntities()?.getDatesList()?.join(', ') || '',
    products: segment.getEntities()?.getProductsList()?.join(', ') || '',
    events: segment.getEntities()?.getEventsList()?.join(', ') || '',
    industries: segment.getEntities()?.getIndustriesList()?.join(', ') || '',
    locations: segment.getEntities()?.getLocationsList()?.join(', ') || '',
    people: segment.getEntities()?.getPeopleList()?.join(', ') || '',
    times: segment.getEntities()?.getTimesList()?.join(', ') || '',
    quantities: segment.getEntities()?.getQuantitiesList()?.join(', ') || '',
  });

  const handleUpdate = () => {
    setError('');
    updateKnowledgeDocumentSegmentEntities({
      documentId: segment.getDocumentId(),
      segmentIndex: segment.getIndex().toString(),
      organizations: parseSegmentEntityList(entities.organizations),
      dates: parseSegmentEntityList(entities.dates),
      products: parseSegmentEntityList(entities.products),
      events: parseSegmentEntityList(entities.events),
      people: parseSegmentEntityList(entities.people),
      times: parseSegmentEntityList(entities.times),
      quantities: parseSegmentEntityList(entities.quantities),
      locations: parseSegmentEntityList(entities.locations),
      industries: parseSegmentEntityList(entities.industries),
      documentName: entities.documentName,
      auth: { projectId, token, userId: authId },
      callback: (err: ServiceError | null, response: BaseResponse | null) => {
        if (err) {
          setError('Failed to update the segment. Please try again.');
        } else {
          onUpdate();
          onClose();
        }
      },
    });
  };

  const handleEntityChange = (key: SegmentEntityKey, value: string) => {
    setEntities(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal open={true} onClose={onClose} size="md">
      <ModalHeader title="Edit Document Segment" onClose={onClose} />
      <ModalBody hasForm>
        <div className="h-[80dvh] overflow-auto p-6">
          <Stack gap={6}>
            <TextInput
              id="document-segment-id"
              labelText="Document Segment ID"
              disabled
              type="text"
              value={segment.getDocumentId()}
            />
            {SEGMENT_ENTITY_FIELDS.map(field => (
              <TextInput
                key={field.key}
                id={`segment-${field.key}`}
                labelText={field.label}
                type="text"
                value={entities[field.key]}
                onChange={e => handleEntityChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            ))}
            {error ? (
              <Notification kind="error" title="Error" subtitle={error} />
            ) : null}
          </Stack>
        </div>
      </ModalBody>

      <ModalFooter>
        <SecondaryButton size="lg" onClick={onClose}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="lg"
          type="button"
          onClick={handleUpdate}
          renderIcon={Checkmark}
        >
          Update document
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
