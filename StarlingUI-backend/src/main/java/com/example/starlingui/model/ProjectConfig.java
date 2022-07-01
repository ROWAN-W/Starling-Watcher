package com.example.starlingui.model;

import java.util.List;

public class ProjectConfig {
    private String id;
    private String name;
    private String kind;
    private ConfigLabel label;
    private List<ProjectContainer> containers;

    private class ConfigLabel {
        private String app;
        private String platform;

        public ConfigLabel() {
            super();
        }
    }

    private class ProjectContainer {
        private String id;
        private String name;
        private String command;
        private String args;
        private List<String> env;
        private List<String> env2;
        private List<String> port;

        public ProjectContainer() {
            super();
        }
    }
}
