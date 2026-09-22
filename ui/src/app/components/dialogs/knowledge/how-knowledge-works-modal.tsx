import { CloudUpload, DataBase, Rocket } from '@carbon/icons-react';
import type { ModalProps } from '@/app/components/ui/primitives';
import { HowItWorksDialog } from '@/app/components/dialogs/shared';

export function HowKnowledgeWorksDialog(props: ModalProps) {
  const steps = [
    {
      title: 'Upload and Explore',
      icon: <CloudUpload size={20} />,
      description:
        "Upload documents from third-party sources or your company's private data. Instantly start AI-powered conversations about their contents, gaining quick insights without complex setups.",
    },
    {
      title: 'Build Knowledge Base',
      icon: <DataBase size={20} />,
      description:
        'Create a powerful knowledge base by simply specifying your data sources. Our system automatically selects the best embedding model, configures storage, and handles syncing, eliminating infrastructure worries.',
    },
    {
      title: 'Deploy and Integrate',
      icon: <Rocket size={20} />,
      description:
        'Seamlessly integrate your knowledge base into your assistant. Enjoy automated syncing and updates without worrying about infrastructure, keeping your AI capabilities always up-to-date.',
    },
  ];

  return <HowItWorksDialog {...props} steps={steps} className="w-1/2" />;
}
