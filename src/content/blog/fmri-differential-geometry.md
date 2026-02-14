---
title: "FMRI Differential Geometry"
description: "A computational neuroscience research project combining differential geometry with topological data analysis to detect spinor-like rotational structures in fMRI data."
pubDate: "May 01 2025"
---

**FMRI Differential Geometry** is a computational neuroscience research project that combines differential geometry with topological data analysis (TDA) to detect spinor-like rotational structures in functional magnetic resonance imaging (fMRI) data. The project hypothesizes that certain patterns of brain activity exhibit continuous rotational symmetry — analogous to spinors in physics — and develops a two-pronged computational pipeline to identify them.

The first prong uses **differential geometry analysis** on the cortical surface: fMRI data is projected onto a cortical mesh (via SPM/CAT12), local activity gradients are computed at each vertex, and divergence/curl operators identify regions of persistent rotational flow. The second prong applies **persistent homology** (via Ripser/GUDHI) to detect topological loops (H1 features) and voids (H2 features) in the functional connectivity structure, which may correspond to cyclic neural activity patterns.

This project integrates multiple toolchains — MATLAB (SPM, CAT12), Python (GUDHI, Ripser, Scikit-TDA), and AFNI/SUMA — across several sub-projects.

---

## Pipeline Architecture

```mermaid
flowchart TD
    subgraph Input["Raw fMRI Data"]
        RAW["T2*-weighted EPI\n3T Scanner"]
    end

    subgraph Part1["Part 1: Differential Geometry"]
        P1A["SPM Preprocessing\nCoregister + Normalize + Smooth"] --> P1B["CAT12 Surface Extraction\nCortical Mesh"]
        P1B --> P1C["AFNI/SUMA\nMap fMRI to Surface"]
        P1C --> P1D["MATLAB\nCompute Gradients"]
        P1D --> P1E["Divergence & Curl\nRotational Patterns"]
        P1E --> P1F["Identify Spinor\nCandidates"]
    end

    subgraph Part2["Part 2: Topological Data Analysis"]
        P2A["AFNI Preprocessing\nExtract ROI Time Series"] --> P2B["Python\nPairwise Correlation Matrix"]
        P2B --> P2C["GUDHI\nVietoris-Rips Complex"]
        P2C --> P2D["Ripser\nPersistent Homology"]
        P2D --> P2E["Persistence Diagrams\nH0, H1, H2 Features"]
        P2E --> P2F["Identify Persistent\nLoops (H1)"]
    end

    RAW --> P1A
    RAW --> P2A
    P1F --> RESULT["Combined Analysis:\nRegions with both rotational\nbehavior AND topological cycles"]
    P2F --> RESULT
```

---

## Part 1: Differential Geometry Analysis

This analysis captures rotation-like structures or orientation properties in the brain's functional activity.

**Tools:**
- **MATLAB** — differential geometry calculations and visualizations
- **SPM** — fMRI preprocessing
- **CAT12** — surface-based analysis (computing curvature)
- **AFNI/SUMA** — surface data and functional data processing

```mermaid
sequenceDiagram
    participant SPM as SPM (MATLAB)
    participant CAT as CAT12
    participant AFNI as AFNI/SUMA
    participant MAT as MATLAB

    SPM->>SPM: Coregister & Normalize
    SPM->>SPM: Smooth & Motion Correct
    SPM->>CAT: Load preprocessed data
    CAT->>CAT: Surface extraction (cortical mesh)
    CAT->>CAT: Compute curvature & sulcal depth
    CAT->>AFNI: Export surface mesh
    AFNI->>AFNI: Project fMRI onto cortical surface
    AFNI->>MAT: Surface-mapped time series
    MAT->>MAT: Compute local gradients per vertex
    MAT->>MAT: Calculate divergence and curl
    MAT->>MAT: Identify high-curl regions (rotation)
    MAT->>MAT: Track rotational ROIs over time
```

**Step-by-Step Process:**

1. **Preprocess fMRI Data** (SPM): Coregister, normalize, smooth, motion correct
2. **Surface Extraction** (CAT12): Generate cortical mesh, compute surface metrics (curvature, sulcal depth)
3. **Map Functional Data to Surface**: Project fMRI onto cortical mesh vertices using AFNI/SUMA
4. **Compute Rotational Symmetry** (MATLAB): Define orientation vectors, calculate local gradients, compute divergence and curl
5. **Identify Rotational Symmetry**: Visualize curl across surface, track high-curl regions over time
6. **Export Results**: Save ROIs exhibiting rotational behavior as masks

---

## Part 2: Topological Data Analysis (TDA)

The goal is to capture loop-like or spherical structures using persistent homology.

```mermaid
flowchart LR
    A["fMRI Time Series\n(ROI x Timepoints)"] --> B["Pairwise\nCorrelation Matrix"]
    B --> C["Threshold\n(Sparse Matrix)"]
    C --> D["Vietoris-Rips\nComplex (GUDHI)"]
    D --> E["Persistent Homology\n(Ripser)"]
    E --> F["H0: Connected\nComponents"]
    E --> G["H1: Loops\n(Spinor Candidates)"]
    E --> H["H2: Voids\n(Spherical Cavities)"]
```

**Step-by-Step Process:**

1. **Preprocess and Extract Data** (AFNI): Segment brain into ROIs, extract time-series as CSV
2. **Format Data for Persistent Homology** (Python): Compute pairwise correlation, threshold matrix
3. **Construct the Simplicial Complex**: Build Vietoris-Rips complex with GUDHI at chosen epsilon
4. **Compute Persistent Homology**: Use Ripser for persistence diagrams (H0, H1, H2)
5. **Identify Spinor-Like Structures**: Find persistent H1 loops with cyclic temporal behavior
6. **Visualize and Interpret**: Persistence diagrams and barcodes via Matplotlib

---

