# base image
FROM nginx

# ARG layers for build time environment variables (to be used in your build script)
ARG SOURCE
ARG COMMIT_HASH
ARG COMMIT_ID
ARG BUILD_TIME

# environment variables
ENV base_path=/usr/share/nginx/html
ENV i18n_path=${base_path}/assets/i18n
ENV entity_spec_path=${base_path}/assets/entity-spec
ENV master_template_path=${base_path}/templates

# Optional: These ARG values can be passed during Docker build
ARG container_user=mosip
ARG container_user_group=mosip
ARG container_user_uid=1001
ARG container_user_gid=1001
ARG artifactory_url

# environment variable for runtime
ENV artifactory_url_env=${artifactory_url}

# Docker Labels
LABEL source=${SOURCE}
      commit_hash=${COMMIT_HASH}
      commit_id=${COMMIT_ID}
      build_time=${BUILD_TIME}

# Install packages and create user
RUN apt-get -y update \
    && apt-get install -y unzip wget zip npm \
    && groupadd -g ${container_user_gid} ${container_user_group} \
    && useradd -u ${container_user_uid} -g ${container_user_group} -s /bin/sh -m ${container_user} \
    && mkdir -p /var/run/nginx /var/tmp/nginx \
    && chown -R ${container_user}:${container_user} /usr/share/nginx /var/run/nginx /var/tmp/nginx

# Set working directory for the user
WORKDIR /home/${container_user}

# Add configuration files
ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./default.conf /etc/nginx/conf.d/
ADD ./download.conf /etc/nginx/include/download.conf

# Change working directory to the user's home
RUN cd /home/${container_user}

# Add dist content
ADD dist ${base_path}

# Change permissions of file inside working dir
RUN chown -R ${container_user}:${container_user} ${base_path}/assets/i18n
RUN chown -R ${container_user}:${container_user} ${base_path}/assets/entity-spec
RUN mkdir -p ${master_template_path} && chown -R ${container_user}:${container_user} ${master_template_path}

# Add start script and set permissions
ADD configure_start.sh configure_start.sh
RUN chmod +x configure_start.sh
RUN chown -R ${container_user}:${container_user} /home/${container_user}

# Select container user for all tasks
USER ${container_user_uid}:${container_user_gid}

# Expose port
EXPOSE 8080

# Set entrypoint
ENTRYPOINT [ "./configure_start.sh" ]

# Get the admin i18n bundle zip from artifactory
CMD echo "starting nginx" ; \
    # wget -q --show-progress "${artifactory_url_env}"/artifactory/libs-release-local/i18n/admin-i18n-bundle.zip -O "${i18n_path}"/admin-i18n-bundle.zip ; \
    # echo "Downloading entity spec bundle" ; \
    # wget -q --show-progress "${artifactory_url_env}"/artifactory/libs-release-local/i18n/admin-entity-spec-bundle.zip -O "${entity_spec_path}"/admin-entity-spec-bundle.zip ; \
    # echo "Downloading templates bundle" ; \
    # wget -q --show-progress "${artifactory_url_env}"/artifactory/libs-release-local/master-templates/master-templates.zip -O "${master_template_path}"/master-templates.zip ; \
    # cd ${entity_spec_path} ; \
    # unzip -o admin-entity-spec-bundle.zip ; \
    # cd ${i18n_path} ; \
    # unzip -o admin-i18n-bundle.zip ; \
    # cd ${master_template_path} ; \
    # unzip -o master-templates.zip ; \
    nginx ; \
    sleep infinity
