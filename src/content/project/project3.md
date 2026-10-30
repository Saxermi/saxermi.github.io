---
slug: cms-vertex-reconstruction
category: Scientific computing
methods: ['C++', 'CMSSW', 'Deterministic annealing', 'ROOT']
title: 'Optimizing Primary Vertex Reconstruction at CMS'
description: 'Semester project and bachelor thesis at PSI on efficient primary-vertex reconstruction for the CMS experiment and the High-Luminosity LHC.'
pubDate: 'Oct 15 2024'
badge: 'Thesis'
tags: ['CMS', 'vertex reconstruction', 'CERN', 'PSI']
period: 'August 2024 – June 2025'
document: 'https://doi.org/10.21256/zhaw-34860'
---

This work began as a ZHAW semester project with Freja Rasmussen in the High Energy Physics group at the Paul Scherrer Institute (PSI). My subsequent bachelor thesis, supervised by Dr. W. Erdmann (PSI / ETH Zurich), focused on track clustering for primary-vertex reconstruction at the CMS experiment at CERN. The research period ran from August 2024 to June 2025.

## Why vertex reconstruction matters

Primary-vertex reconstruction separates proton–proton collision vertices and assigns tracks to them. The high-pileup conditions expected at the High-Luminosity LHC make both reconstruction quality and computation time important.

## From block-wise clustering to CascadeDA

I evaluated Deterministic Annealing in Blocks on HL-LHC simulation data and identified block-border effects as the main limitation for reconstruction quality. I developed **CascadeDA**, a hybrid algorithm combining block-wise pre-clustering with global deterministic annealing.

As reported in my CV, CascadeDA achieved **60% faster clustering** than the previous implementation on large-scale CMS tracking datasets while maintaining **sub-10 µm z-resolution** and **99% track-to-vertex assignment efficiency**. These results describe this evaluation, rather than a general performance guarantee.

## Research and learning

Both the semester project (6 ECTS) and bachelor thesis (12 ECTS) were graded 6/6. During this work, I attended the Inverted CERN School of Computing (iCSC 2025) in Meyrin, with hands-on modules in HEP computing, machine learning and software best practices.

The thesis is titled _Optimization of Track Clustering for Primary Vertex Reconstruction in Proton-Proton Collisions at the CMS Experiment at CERN_.
