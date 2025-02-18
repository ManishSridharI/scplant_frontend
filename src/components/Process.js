import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import { styled } from '@mui/material/styles';
import { Link } from '@mui/material';

import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';

const items = [
  {
    icon: <LooksOneIcon />,
    title: 'Introduction',
    description:
      'scPlantAnnotate annotates cell types for plants.',
    imageLight: `url("/workflow.png")`,
    imageDark: `url("/workflow.png")`,
    description2:
    'Cell type annotation is fundamental for interpreting scRNA-seq data in biomedical and plant research, as it enables detailed insights into cellular composition, function, and dynamics within tissues. This understanding leads to significant insights into biology, development, and responses to environmental changes. ',
    description3:
    'The scPlantAnnotate server can annotate cell types for four plant species: Arabidopsis thaliana, Zea mays, Glycine max, and Oryza sativa. Users can upload scRNA-seq data files (currently only h5ad file format is supported) for annotation. We also provided an example dataset for each plant species.',
  },
  {
    icon: <LooksTwoIcon />,
    title: 'Models and Datasets',
    description:
      'Transformer-based models trained on diverse datasets.',
    imageLight: `url("/models.png")`,
    imageDark: `url("/models.png")`,
    description2:
    'scPlantAnnotate is a Transformer-based deep learning model. It consists of five transformer layers followed by dense layers for different tasks. It adopted a two-stage training strategy(pretraining and finetuning). The advantage is that pretraining is a self-supervised training which does not need data to be labeled, therefore it can leverage large amounts of scRNA-seq data to make the model learn gene co-expression patterns, making the model more robust to batch effect. Another advantage is that the latent representation obtained from the pretrained model can be used for many different downstream tasks, making it a foundational model, although in this study we specifically only focus on one downstream task -- cell type annotation.',
    description3:
    'scPlantAnnotate-unified model for Arabidopsis  trained on 28 datasets spanning all tissues, comprising 1.2 million cells spanning 50 cell types. scPlantAnnotate-unified model for Zmays trained on 9 datasets with a total of 351,000 cells spanning 38 cell types. scPlantAnnotate-unified model for Osativa was trained on five datasets with a total of 417,000 cells spanning 38 cell types. scPlantAnnotate-unified model for Glycine max was trained on ten datasets with a total of 116,000 cells spanning 42 cell types.',

  },
  {
    icon: <Looks3Icon />,
    title: 'Predictions',
    description:
      'High-throughput scRNA-seq data annotation.',
    imageLight: `url("/results.jpg")`,
    imageDark: `url("/results.jpg")`,
    description2:
    'scPlantAnnotate will annotate cell types for each dataset and generates a comprehensive output, including a CSV file of predicted cell types, cluster visualization figures using t-SNE and UMAP, and a dot-plot of cluster-specific marker genes. For multiple scRNA-seq data files with different conditions, the service also performs cross-condition analyses, such as identifying marker genes and comparing cell type distributions. The data processing tasks in the scPlantAnnotate are designed to queue and execute automatically depending on the hosting server resource availability. Results are typically available in minutes to a few hours, depending on the server resource usage. The scPlantAnnotate is optimized for high-throughput scRNA-seq data annotation to enable researchers to quickly obtain reliable and reproducible cell-type annotations without requiring extensive computational expertise. ',
    description3:
    '',
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: 280,
            backgroundImage: 'var(--items-imageLight)',
            ...theme.applyStyles('dark', {
              backgroundImage: 'var(--items-imageDark)',
            }),
          })}
          style={
            items[selectedItemIndex]
              ? {
                  '--items-imageLight': items[selectedItemIndex].imageLight,
                  '--items-imageDark': items[selectedItemIndex].imageDark,
                }
              : {}
          }
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function Process() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '100%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Workflow
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          See below to understand the process of scPlantAnnotate. (Click Here to download the <Link href="/Website_Instructions.pdf" download sx={{ color: "primary.main", textDecoration: "underline", cursor: "pointer" }}>Instruction manual</Link>)
        </Typography>
      </Box>
      <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'row',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}

                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>
      
      <Box sx={{ m2: 4,mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
  <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontSize:'1.5rem' }}>
    {selectedFeature.title}
  </Typography>
  <Typography variant="body2" sx={{marginTop:'5px',color: 'text.secondary', fontSize:'1rem' }}>
    {selectedFeature.description2}
    </Typography>

    <Typography variant="body2" sx={{ marginTop:'10px', color: 'text.secondary', fontSize:'1rem' }}>
    {selectedFeature.description3}
  </Typography>
</Box>
<Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '100%' },
            height: 'var(--items-image-height)',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={(theme) => ({
                m: 'auto',
                width: 1200,
                height: 1000,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: 'var(--items-imageLight)',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'var(--items-imageDark)',
                }),
              })}
              style={
                items[selectedItemIndex]
                  ? {
                      '--items-imageLight': items[selectedItemIndex].imageLight,
                      '--items-imageDark': items[selectedItemIndex].imageDark,
                    }
                  : {}
              }
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
